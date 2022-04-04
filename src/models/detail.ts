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
