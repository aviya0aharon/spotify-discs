import { Injectable } from '@angular/core';

import { from, map, Observable } from 'rxjs';
import { SpotifyApi, Album, SearchResults } from '@spotify/web-api-ts-sdk';

import { PAGE_SIZE } from '../../constants/config';
import { SpotifySearchResults } from '../../types/basic-album-info.type';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '../../constants/spotify-config';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private sdk: SpotifyApi;

  constructor() {
    this.sdk = SpotifyApi.withClientCredentials(
      SPOTIFY_CLIENT_ID,
      SPOTIFY_CLIENT_SECRET,
      ['user-read-private']
    );
  }

  search(query: string, pageNumber: number): Observable<SpotifySearchResults> {
    const offset = (pageNumber - 1) * PAGE_SIZE;
    return this.changeToBasicAlbumInfoObservable(this.sdk.search(query, ["album"], undefined, PAGE_SIZE, offset));
  }

  private changeToBasicAlbumInfoObservable(source: Promise<SearchResults<["album"]>>): Observable<SpotifySearchResults> {
    return from(source).pipe(
      map((response: SearchResults<["album"]>) => ({ albums: response.albums?.items || [], isLastPage: response.albums?.next === null })),
      map(({ albums, isLastPage }) => ({
        albums: albums.map(album => ({
          name: album.name, id: album.id, releaseDate: album.release_date, image: album.images[0]?.url || ''
        })),
        isLastPage
      }))
    )
  }

  getByID(id: string): Observable<Album> {
    return from(this.sdk.albums.get(id));
  }
}