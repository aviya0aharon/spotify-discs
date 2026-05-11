import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Component, signal, WritableSignal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { catchError, of, tap } from 'rxjs';
import { Album } from '@spotify/web-api-ts-sdk';

import { PageState } from '../../enums/page-state.enum';
import { SpotifyService } from '../../services/spotify/spotify.service';

@Component({
  selector: 'app-disc-information-page',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, RouterModule],
  templateUrl: './disc-information.page.html',
  styleUrl: './disc-information.page.scss'
})
export class DiscInformationPage {
  public disc: WritableSignal<Album | null> = signal(null);
  public loadingState: WritableSignal<PageState> = signal(PageState.Loading);
  public PageState = PageState;

  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService
  ) { }

  async ngOnInit() {
    const id = this.route.snapshot.queryParams['id'];

    if (id !== undefined && id !== null) {
      this.spotifyService.getByID(id).pipe(
        tap(() => this.loadingState.set(PageState.Loaded)),
        tap((disc: Album) => this.disc.set(disc)),
        catchError(err => {
          console.error('Error fetching album information:', err);
          this.loadingState.set(PageState.Error);
          return of(null);
        })
      ).subscribe();

    } else {
      console.error('No album ID was found');

      this.loadingState.set(PageState.Error);
    }
  }
}
