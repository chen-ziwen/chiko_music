export interface SearchHotDetail {
    alg: string,
    content?: string,
    iconTpe: number,
    iconUrl: string,
    score: number,
    searchWord: string,
    source: number,
    url: string,
}

export interface SearchSong {

}

export interface RecommendList {
    alg: string,
    canDislike: boolean | null,
    highQuality: boolean,
    id: number,
    name: string,
    picUrl: string,
    playCount: number,
    trackCount: number,
    trackNumberUpdateTime: number,
    type: number,

}

export interface TopArtists {
    name: string,
    alias: string[],
    id: number,
    picUrl: string,
    img1v1Url: string,
    musicSize: number
}

export interface Newsong {
    id: number,
    name: string,
    picUrl: string,
    song: {
        artists: [];
        duration: number
    },
}