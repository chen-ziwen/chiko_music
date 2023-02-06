import { changetime, changeNum } from '@/hook';
export interface MvType {
    id: number;
    imgurl: string;
    artistName: string;
    duration: string;
    playCount: string;
    info: string;
}
export function useMv(MvList: any[]) {
    const newMvList: MvType[] = [];
    for (let i = 0; i < MvList.length; i++) {
        const MvInfo: MvType = {
            id: MvList[i].id,
            info: MvList[i].name,
            imgurl: MvList[i].cover || MvList[i].imgurl,
            artistName: MvList[i].artistName,
            duration: changetime(MvList[i].duration),
            playCount: changeNum(MvList[i].playCount) as string,
        }
        newMvList.push(MvInfo);
    }
    return newMvList;
}