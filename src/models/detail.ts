
// 精品歌单 creator
interface AvatarDetail {
    identityLevel: number,
    identityIconUrl: string
}
export interface Creator {
    avatarUrl: string;
    userId: number;
    nickname: string;
    avatarDetail: AvatarDetail;
}
// 歌曲列表
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

// 歌单列表
export interface RecommendList {
    [x: string]: any;
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
    updateTime: number;
    trackNumberUpdateTime: number;
    copywriter: string;
    creator: Creator;
    type: number;

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