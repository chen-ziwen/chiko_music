
import { formatSecond, imgurl } from '@/util';

interface SongList {
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


export const useSong = (songList: any) => {
    const songMsg: SongList = {
        id: songList.id,
        singer: songList.ar || songList.artists,
        name: songList.name,
        album: songList.al ? songList.al.name : songList.album.name,
        duration: formatSecond(songList.dt || songList.duration),
        image: songList.al ? songList.al.picUrl : songList.album.artist.img1v1Url,
        url: `https://music.163.com/song/media/outer/url?id=${songList.id}.mp3`,
        playCount: songList.playCount || "",
        score: songList.score || "",
        index: songList.index
    }
    return songMsg;
}

