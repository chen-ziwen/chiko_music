export interface TagSearch<T> {
    albums: T;
    artists: T;
    playlists: T;
    songs: T;
    mv: T;
}

export interface SearchHotDetailType {
    alg: string;
    content?: string;
    iconType: number;
    iconUrl: string;
    score: number;
    searchWord: string;
    source: number;
    url: string;
}

export interface SearchSuggestType {
    albums?: { name: string }[];
    artists?: { name: string }[];
    songs?: { name: string }[];
    playlists?: { name: string }[]
}