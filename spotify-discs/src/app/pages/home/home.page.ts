import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { Component, computed, signal, WritableSignal } from '@angular/core';

import { catchError, of, tap } from 'rxjs';

import { PageState } from '../../enums/page-state.enum';
import { BasicAlbumInfo } from '../../types/basic-album-info.type';
import { SpotifyService } from '../../services/spotify/spotify.service';
import { DiscItemComponent } from '../../components/disc-item/disc-item.component';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DiscItemComponent,
    MatProgressSpinner
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage {
  public query: WritableSignal<string> = signal('');
  public discs: WritableSignal<BasicAlbumInfo[]> = signal([]);
  public lastQueries: WritableSignal<string[]> = signal([]);
  public loadingState: WritableSignal<PageState> = signal(PageState.Loaded);
  private pageNumber: WritableSignal<number> = signal(1);
  public readonly hasPrevDisabled = computed(() => this.pageNumber() === 1);
  public readonly hasResults = computed(() => this.discs().length > 0);
  public PageState = PageState;

  constructor(private readonly spotifyService: SpotifyService, private readonly localStorageService: LocalStorageService) {
    this.loadQueries();
  }

  search() {
    const query = this.query().trim();

    if (query === '') {
      return;
    }

    this.saveQuery(query);
    this.pageNumber.set(1);
    this.loadingState.set(PageState.Loading);

    this.spotifyService.search(query).pipe(
      tap(() => this.loadingState.set(PageState.Loaded)),
      tap((response: BasicAlbumInfo[]) => this.discs.set(response)),
      catchError(err => {
        this.loadingState.set(PageState.Error);
        console.error('Error searching for albums:', err);
        return of([]);
      })
    ).subscribe();
  }

  next() {
    this.changePage(1);
  }

  previous() {
    this.changePage(-1);
  }


  private saveQuery(query: string) {
    if (this.lastQueries().includes(query)) {
      return;
    }

    const lastQueries = [query, ...this.lastQueries()]
      .slice(0, 5);

    this.lastQueries.set(lastQueries);

    try {
      this.localStorageService.set('lastQueries', JSON.stringify(lastQueries));
    } catch (error) {
      console.error('Error saving queries to localStorage:', error);
    }
  }

  private loadQueries() {
    try {
      const data: string | null = this.localStorageService.get('lastQueries');

      if (data !== null && data !== undefined) {
        const parsed = JSON.parse(data);

        if (Array.isArray(parsed)) {
          this.lastQueries.set(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading queries from localStorage:', error);
      this.lastQueries.set([]);
    }
  }

  private changePage(offset: number) {
    const newPage = this.pageNumber() + offset;

    if (newPage < 1) return;

    this.loadingState.set(PageState.Loading);

    this.spotifyService.getPage(newPage).pipe(
      tap((response: BasicAlbumInfo[]) => this.discs.set(response)),
      tap(() => this.loadingState.set(PageState.Loaded)),
      tap(() => this.pageNumber.set(newPage)),
      catchError(err => {
        this.loadingState.set(PageState.Error);
        console.error('Error fetching page:', err);
        return of([]);
      })
    ).subscribe();
  }
}
