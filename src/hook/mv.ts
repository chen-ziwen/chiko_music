import { changetime, changeNum } from '@/hook';
export interface MvType {
    id: number;
    imgurl: string;
    artistName: string;
    duration: string;
    playCount: string;
    info: string;
}
export function useMv(MvList: any) {
    const MvInfo: MvType = {
        id: MvList.id,
        info: MvList.name,
        imgurl: MvList.cover || MvList.imgurl,
        artistName: MvList.artistName,
        duration: changetime(MvList.duration),
        playCount: changeNum(MvList.playCount) as string,
    }
    return MvInfo;
}