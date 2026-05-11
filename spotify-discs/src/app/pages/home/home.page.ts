import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal, effect, untracked } from '@angular/core';
import { MatProgressSpinner } from "@angular/material/progress-spinner";

import { PageState } from '../../enums/page-state.enum';
import { basicAlbumInfo } from '../../types/basic-album-info.type';
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
  readonly AlbumInPage = 5;
  public query: WritableSignal<string> = signal('');
  public discs: WritableSignal<basicAlbumInfo[]> = signal([]);
  public lastQueries: WritableSignal<string[]> = signal([]);
  public loadingState: WritableSignal<PageState> = signal(PageState.Loaded);
  public pageNumber: WritableSignal<number> = signal(1);
  public PageState = PageState;

  constructor(private discsService: SpotifyService, private localStorageService: LocalStorageService) {
    this.loadQueries();
  }

  search() {
    const query = this.query().trim();

    if (query === '') {
      return;
    }

    this.saveQuery(query);
    this.pageNumber.set(1);
    this.fetchSearch(query, 1);

  }

  fetchSearch(query: string, page: number) {
    this.loadingState.set(PageState.Loading);

    this.discsService.search(query, (page - 1) * this.AlbumInPage)
      .then((response: basicAlbumInfo[]) => {
        this.loadingState.set(PageState.Loaded);
        this.discs.set(response);
      }).catch(err => {
        this.loadingState.set(PageState.Error);

        console.error('Error searching for albums:', err);
      });
  }

  saveQuery(query: string) {
    if (this.lastQueries().includes(query)) {
      return;
    }

    let lastQueries: string[] = this.lastQueries();
    lastQueries.unshift(query);
    lastQueries = lastQueries.slice(0, 5);

    this.lastQueries.set(lastQueries);

    try {
      this.localStorageService.set('lastQueries', JSON.stringify(lastQueries));
    } catch (error) {
      console.error('Error saving queries to localStorage:', error);
    }
  }

  loadQueries() {
    try {
      const data: string | null = this.localStorageService.get('lastQueries');

      if (data !== null && data !== undefined) {
        this.lastQueries.set(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading queries from localStorage:', error);
      this.lastQueries.set([]);
    }
  }

  next() {
    const query = this.query().trim();
    if (query === '') {
      return;
    }

    const newPageNumber = this.pageNumber() + 1;
    this.fetchSearch(this.query(), newPageNumber);
    this.pageNumber.set(newPageNumber);
  }

  previous() {
    const query = this.query().trim();

    if (query === '') {
      return;
    }

    if (this.pageNumber() > 1) {
      const newPageNumber = this.pageNumber() - 1;
      this.fetchSearch(this.query(), newPageNumber);
      this.pageNumber.set(newPageNumber);
    }
  }
}