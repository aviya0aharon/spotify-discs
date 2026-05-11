import { Injectable } from '@angular/core';

import { SpotifyApi, SimplifiedAlbum, Album, MaxInt } from '@spotify/web-api-ts-sdk';

import { basicAlbumInfo } from '../../types/basic-album-info.type';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private readonly spotify_client_id = process.env['SPOTIFY_CLIENT_ID']
  private readonly spotify_client_secret = process.env['SPOTIFY_CLIENT_SECRET']
  private sdk: SpotifyApi;
  private readonly albumsPerPage: MaxInt<50> = 5;

  constructor() {
    this.sdk = SpotifyApi.withClientCredentials(
      this.spotify_client_id,
      this.spotify_client_secret,
      ['user-read-private']
    );
  }

  async search(name: string, offset: number = 0): Promise<basicAlbumInfo[]> {
    if (!name) return [];

    const rawResult: SimplifiedAlbum[] = (await this.sdk.search(name, ["album"], undefined, this.albumsPerPage, offset)).albums?.items || [];
    const results = rawResult.map(album => ({ name: album.name, id: album.id, releaseDate: album.release_date, image: album.images[0]?.url || '' }));
    return results;
  }

  async getByID(id: string): Promise<Album> {
    return await this.sdk.albums.get(id);
  }
}