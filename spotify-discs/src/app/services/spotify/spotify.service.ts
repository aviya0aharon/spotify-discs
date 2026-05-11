import { Injectable } from '@angular/core';

import { from, map, Observable, of, pipe } from 'rxjs';
import { SpotifyApi, Album, SearchResults } from '@spotify/web-api-ts-sdk';

import { PAGE_SIZE } from '../../constants/config';
import { BasicAlbumInfo } from '../../types/basic-album-info.type';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private readonly spotify_client_id = process.env['SPOTIFY_CLIENT_ID']
  private readonly spotify_client_secret = process.env['SPOTIFY_CLIENT_SECRET']
  private sdk: SpotifyApi;
  private lastQuery: string = '';


  constructor() {
    this.sdk = SpotifyApi.withClientCredentials(
      this.spotify_client_id,
      this.spotify_client_secret,
      ['user-read-private']
    );
  }

  search(name: string): Observable<BasicAlbumInfo[]> {
    if (!name) return of([]);
    this.sdk.search(name, ["album"])
    this.lastQuery = name;
    const results: Observable<BasicAlbumInfo[]> = from(this.sdk.search(name, ["album"])).pipe(
      this.formatAlbum()
    );
    return results;
  }

  getPage(pageNumber: number): Observable<BasicAlbumInfo[]> {
    const offset = (pageNumber - 1) * PAGE_SIZE;
    return from(this.sdk.search(this.lastQuery, ["album"], undefined, PAGE_SIZE, offset)).pipe(
      this.formatAlbum()
    );
  }

  private formatAlbum() {
    return pipe(
      map((response: SearchResults<["album"]>) => response.albums?.items || []),
      map((albums) => albums.map(album => ({ name: album.name, id: album.id, releaseDate: album.release_date, image: album.images[0]?.url || '' })))
    )
  }

  getByID(id: string): Observable<Album> {
    return from(this.sdk.albums.get(id));
  }
}