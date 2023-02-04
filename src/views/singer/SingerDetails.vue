<template>
    <div class="singer-details">
        <div class="singer-details-msg">
            <el-image class="singer-img" :src="artDil?.cover + '?param=400y400'"></el-image>
            <div class="singer-msg">
                <span class="artist-name">{{ artDil.name }}</span>
                <div class="music-size">
                    <span>单曲数：{{ artDil.musicSize }}</span>
                    <span>专辑数：{{ artDil.albumSize }}</span>
                    <span>MV数：{{ artDil.mvSize }}</span>
                </div>
                <span class="artist-brief">{{ artDil.briefDesc }}</span>
            </div>
        </div>
        <div class="module-checked">
            <el-tabs v-model="checkedname" type="card" class="demo-tabs" @tab-click="checkedClick">
                <el-tab-pane label="热门歌曲" name="hot">
                    <SongList :sheetList="delSong" @keeplist="keepsheet"></SongList>
                </el-tab-pane>
                <el-tab-pane label="专辑" name="album">
                    <LoadScroll :distance="100" @load-scorll="loadScroll">
                        <SingerAlbum :data="artAlbum"></SingerAlbum>
                    </LoadScroll>
                </el-tab-pane>
                <el-tab-pane label="MV" name="mv">
                    <MvList :list="artMV"></MvList>
                </el-tab-pane>
                <el-tab-pane label="歌手详情" name="detail">
                    <SingerMsg :data="artDesc.intro" :text="artDesc.brief"></SingerMsg>
                </el-tab-pane>
                <el-tab-pane label="相似歌手" name="like">
                    <template v-if="singerList && singerList.length > 0">
                        <SingerSheet :singer-list="singerList"></SingerSheet>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script lang='ts' setup>
import type { SingerDetail, ArtMV, SongList as SongListType, SingerAlbumType } from '@/models'
import { usePlay } from '@/store/play';
import { watch, ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSong } from '@/hook';
import { getArtists, getArtistMv, getSimiArtist, getArtistAlbum, getArtistDesc, getArtistDetail } from '@/api/http/api';
import SingerMsg from '@/components/singer/SingerMsg.vue';
import SongList from '@/components/song-sheet/SongList.vue';
import SingerAlbum from '@/components/singer/SingerAlbum.vue';
import SingerSheet from '@/components/singer/SingerSheet.vue';
import LoadScroll from '@/components/common/LoadScroll.vue';
import MvList from '@/components/mv/MvList.vue';

const route = useRoute();
const router = useRouter();
const play = usePlay();
// tabs选择
const checkedname = ref<string>('hot');
const singerId = ref<number>(0);
const checkedClick = (name: { paneName: string }) => {
    if (name.paneName == 'like' && !play.loginStatu) {
        router.push({ name: 'login' })
    }
}
const delSong = reactive<SongListType[]>([]);
// 歌手详情  (歌曲数、专辑数)
const artDesc: { intro: [], brief: string } = reactive({ intro: [], brief: '暂无数据' });
//歌手描述 
const artDil = ref<SingerDetail>({
    albumSize: 0,
    musicSize: 0,
    mvSize: 0,
    briefDesc: '',
    cover: 'none',
    name: '正在加载中...',
    identities: [],
});
// 歌手专辑
const artAlbum = ref<SingerAlbumType[]>([]);
const singerList = ref<any>();
const artMV = ref<ArtMV[]>([]);
let albumOffset = 0;
let albumMore = false;

// 歌手详情
const artistDesc = async (id: number) => {
    try {
        const { briefDesc, introduction } = await getArtistDesc(id);
        artDesc.intro = introduction;
        artDesc.brief = briefDesc;
    } catch (e) {
        console.log(e, '歌手详情请求失败');
    }
}

// 歌手描述
const artDetail = async (id: number) => {
    try {
        const { data } = await getArtistDetail(id);
        artDil.value = data.artist;
    } catch (e) {
        console.log(e, '歌手描述请求失败');
    }
}
// 歌手50首热门歌曲
const singerHotsongs = async (id: number) => {
    try {
        delSong.splice(0, delSong.length);
        const { artist, hotSongs } = await getArtists(id);
        for (let item of hotSongs) {
            delSong.push(useSong(item))
        }
    } catch (e) {
        console.log(e, '歌手热门歌曲获取失败');
    }
}

// 相似歌手 需要登陆
const simiArtist = async (id: number) => {
    try {
        const { artists } = await getSimiArtist(id);
        singerList.value = artists;
    } catch (e) {
        console.log(e, '相似歌手需要的登陆才能获取');
    }
}

const singerMv = async (id: number) => {
    try {
        const { mvs } = await getArtistMv(id);
        artMV.value = mvs;
        console.log(artMV.value, '6666');
    }
    catch (e) {
        console.log(e, '获取歌手mv失败')
    }
}


// 歌手专辑 
const ArtistAlbum = async (id: number) => {
    try {
        const { hotAlbums, more } = await getArtistAlbum(id, 30, albumOffset);
        artAlbum.value = artAlbum.value.concat(hotAlbums);
        albumMore = more;
        if (albumMore) {
            albumOffset += 30;
        } else {
            albumOffset = 0;
        }
    }
    catch (e) {
        console.log(e, '歌手专辑获取失败');
    }
}
const loadScroll = () => {
    if (albumMore) {
        ArtistAlbum(singerId.value)
    }
}
// 将当前歌单列表和当前索引值保存到pinia中
const keepsheet = (index: number) => {
    // 这边delSong数组得深拷贝一下，不然会有关联，歌单id变化会一起变化
    const songArr = JSON.parse(JSON.stringify(delSong));
    play.$patch({
        currentindex: index,
        playList: songArr,
    })
}

watch(() => route.query.singerid, (id) => {
    if (!id) return;
    const singerid = id as unknown as number;
    singerId.value = singerid;
    artistDesc(singerid);
    artDetail(singerid);
    singerHotsongs(singerid);
    simiArtist(singerid);
    ArtistAlbum(singerid);
    singerMv(singerid);
}, { immediate: true });

</script>
<style lang='scss' scoped>
.singer-details {
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: #ffffff;
    margin: 20px 0;
    border-radius: 15px;

    .singer-details-msg {
        display: flex;
        margin: 30px;

        .singer-img {
            flex-shrink: 0;
            width: 250px;
            height: 250px;
            border-radius: 5px;
            border: 2px solid #f87a8f;
        }

        .singer-msg {
            display: flex;
            flex-direction: column;
            margin-left: 35px;

            .artist-name {
                font-size: 26px;
                font-weight: 700;
                margin-bottom: 20px;
            }

            .music-size {
                >span {
                    margin-right: 30px;
                }
            }

            .artist-brief {
                margin-top: 20px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 6;
                overflow: hidden;
                color: rgb(139, 138, 138);
                line-height: 26px;
            }
        }
    }

    .module-checked {
        margin: 15px 30px;

        &:deep(.el-tabs) {
            --el-color-primary: #f87a8f;
        }
    }

}
</style>