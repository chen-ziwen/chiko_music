export interface ArtMV {
    artist: string;
    artistName: string;
    duration: string;
    id: number;
    imgurl: string;
    imgurl16v9: string;
    name: string;
    playCount: number;
    publishTime: string;
    status: boolean;
}

export interface MvDetailType {
    desc: string;
    name: string;
    videoGroup: { id: string, name: string }[];
    publishTime: number;
    playCount: number;
    subCount: number;
}
export interface VideoInfoType {
    isLike: number;
    likeCount: number;
    shareCount: number;
    commentCount: number;
    commentTotal: number;
}