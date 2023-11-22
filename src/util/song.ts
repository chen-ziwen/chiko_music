
import { formatSecond } from '@/util';

interface SongList {
    id: number;
    singer: string;
    name: string;
    album: string;
    duration: number;
    image: string;
    url: string;
    playCount: string | number;
    score: string | number;
    idx: number;
}


export const useSong = (songList: any[]) => {
    const newSongList: SongList[] = [];
    for (let i = 0; i < songList.length; i++) {
        const songMsg: SongList = {
            id: songList[i].id,
            singer: filterSinger(songList[i].ar || songList[i].artists),
            name: songList[i].name,
            album: songList[i].al ? songList[i].al.name : songList[i].album.name,
            duration: formatSecond(songList[i].dt || songList[i].duration),
            image: songList[i].al ? songList[i].al.picUrl : songList[i].album.artist.img1v1Url,
            url: `https://music.163.com/song/media/outer/url?id=${songList[i].id}.mp3`,
            playCount: songList[i].playCount || "",
            score: songList[i].score || "",
            idx: i + 1,
        }
        newSongList.push(songMsg);
    }
    return newSongList;
}

function filterSinger(singer: { name: string }[]) {
    if (!singer) {
        return '';
    }
    return singer.map((item: any) => item.name).join('/');
}
