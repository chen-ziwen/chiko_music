export interface SearchHotDetail {
    alg: string;
    content?: string;
    iconTpe: number;
    iconUrl: string;
    score: number;
    searchWord: string;
    source: number;
    url: string;
}

export interface SongList {
    id: number;
    singer: any[];
    name: string;
    album: string;
    duration: number;
    image: string;
    url: string;
    playCount: string | number;
    score: string | number;
    index: number;
}

export interface RecommendList {
    alg: string;
    canDislike: boolean | null;
    highQuality: boolean;
    id: number;
    name: string;
    picUrl: string;
    coverImgUrl: string;
    playCount: number;
    trackCount: number;
    songList: SongList[];
    trackNumberUpdateTime: number;
    type: number;
    // [x: string]: any;

}

export interface TopArtists {
    name: string;
    alias: string[];
    id: number;
    picUrl: string;
    img1v1Url: string;
    musicSize: number;
}

export interface Newsong {
    id: number;
    name: string;
    picUrl: string;
    song: {
        artists: [];
        duration: number;
    }
}