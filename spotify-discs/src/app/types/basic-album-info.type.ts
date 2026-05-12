export type SpotifySearchResults = {
    isLastPage: boolean;
    albums: BasicAlbumInfo[];
}

export type BasicAlbumInfo = {
    name: string;
    id: string;
    releaseDate: string;
    image: string;
}