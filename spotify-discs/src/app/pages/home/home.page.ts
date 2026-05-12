import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { Component, computed, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { catchError, combineLatest, debounceTime, distinctUntilChanged, filter, map, of, switchMap, tap } from 'rxjs';

import { PageState } from '../../enums/page-state.enum';
import { SpotifyService } from '../../services/spotify/spotify.service';
import { DiscItemComponent } from '../../components/disc-item/disc-item.component';
import { BasicAlbumInfo, SpotifySearchResults } from '../../types/basic-album-info.type';
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
  public isLastPage: WritableSignal<boolean> = signal(true);
  public readonly hasPrevDisabled = computed(() => this.pageNumber() === 1);
  public readonly hasResults = computed(() => this.discs().length > 0);
  public PageState = PageState;

  private pageNumber: WritableSignal<number> = signal(1);

  constructor(private readonly spotifyService: SpotifyService, private readonly localStorageService: LocalStorageService) {
    this.loadQueries();
    this.createSearch$();
  }

  next() {
    this.changePage(1);
  }

  previous() {
    this.changePage(-1);
  }

  private createSearch$() {
    combineLatest([
      toObservable(this.pageNumber),
      toObservable(this.query).pipe(
        map(query => query.trim()),
        filter(query => query !== ''),
        distinctUntilChanged(),
        tap(() => this.pageNumber.set(1))
      ),
    ]).pipe(
      takeUntilDestroyed(),
      debounceTime(500),
      tap(() => this.loadingState.set(PageState.Loading)),
      map(([pageNumber, query]) => ({ pageNumber, query })),
      switchMap(({ pageNumber, query }) => this.spotifyService.search(query, pageNumber).pipe(
        tap((response: SpotifySearchResults) => console.log(response.isLastPage)),
        tap((response: SpotifySearchResults) => this.isLastPage.set(response.isLastPage)),
        map((response: SpotifySearchResults) => response.albums),
        tap((response: BasicAlbumInfo[]) => this.discs.set(response)),
        tap(() => this.saveQuery(query)),
        tap(() => this.loadingState.set(PageState.Loaded)),
        catchError(err => {
          this.loadingState.set(PageState.Error);
          console.error('Error searching for albums:', err);
          return of([]);
        })
      ))
    ).subscribe();
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
    this.pageNumber.set(newPage);
  }
}
