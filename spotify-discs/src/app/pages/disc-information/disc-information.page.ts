import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
export class DiscInformationPage implements OnInit {
  public disc: WritableSignal<Album> = signal({} as Album);
  public loadingState: WritableSignal<PageState> = signal(PageState.Loading);
  public PageState = PageState;

  constructor(
    private route: ActivatedRoute,
    private discsService: SpotifyService
  ) { }

  async ngOnInit() {
    const id = this.route.snapshot.queryParams['id'];

    if (id !== undefined && id !== null) {
      this.discsService.getByID(id).then(disc => {

        if (disc) {
          this.loadingState.set(PageState.Loaded);
          this.disc.set(disc);
        }
      }).catch(err => {
        this.loadingState.set(PageState.Error);
      });
    } else {
      this.loadingState.set(PageState.Error);
    }
  }
}
