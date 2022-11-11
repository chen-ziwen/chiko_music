
// 歌手列表
export interface SingerListType {
    albumSize: number;
    alias: string[];
    briefDesc: string;
    followed: boolean;
    id: number;
    imglvlId: number;
    imglvlId_str: string;
    imglvlUrl: string;
    musicSize: number;
    name: string;
    picId: number;
    picId_str: string;
    picUrl: string;
    topicPerson: number;
    trans: string;
}

// 歌手详情
export interface SingerDetail {
    id: number;
    cover: string;
    name: string;
    albumSize: number;
    musicSize: number;
    mvSize: number;
}