<template>
    <div class="singer-details">
        <div class="singer-details-msg">
            <el-image class="singer-img" :src="artDil?.cover + '?param=400y400'" />
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
                    <SongList v-if="delSong.length" :sheetList="delSong" @playIdx="playIdx" />
                    <p v-else>暂无热门歌曲</p>
                </el-tab-pane>
                <el-tab-pane label="专辑" name="album">
                    <LoadScroll :distance="100" @load-scorll="loadScroll">
                        <SingerAlbum v-if="artAlbum.length" :data="artAlbum" />
                        <p v-else>暂无专辑</p>
                    </LoadScroll>
                </el-tab-pane>
                <el-tab-pane label="热门MV" name="mv">
                    <MvList v-if="artMv.length" :list="artMv" @mvid="turnMvDetail" />
                    <p v-else>暂无热门MV</p>
                </el-tab-pane>
                <el-tab-pane label="歌手详情" name="detail">
                    <SingerMsg v-if="artDesc.intro.length" :data="artDesc.intro" :text="artDesc.brief" />
                    <p v-else>暂无歌手详情</p>
                </el-tab-pane>
                <el-tab-pane label="相似歌手" name="like">
                    <SingerSheet :singer-list="singerList" v-if="singerList.length" />
                    <p v-else>暂无相似歌手</p>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script lang='ts' setup>
import type { SingerDetail, SongList as SongListType, SingerAlbumType, SingerListType } from '@/models'
import { usePlay } from '@/store/play';
import { watch, ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSong, useMv, MvType } from '@/util';
import { getArtists, getArtistMv, getSimiArtist, getArtistAlbum, getArtistDesc, getArtistDetail } from '@/api/http/api';
import SingerMsg from '@/components/singer/SingerMsg.vue';
import SongList from '@/components/song-sheet/SongList.vue';
import SingerAlbum from '@/components/singer/SingerAlbum.vue';
import SingerSheet from '@/components/singer/SingerSheet.vue';
import LoadScroll from '@/components/common/LoadScroll.vue';
import MvList from '@/components/mv/MvList.vue';
import Loading from '@/components/common/loading/Loading.vue';
import { TabsPaneContext } from 'element-plus';

const route = useRoute();
const router = useRouter();
const play = usePlay();
const checkedname = ref<string>('hot');
const singerId = ref<number>(0);
const delSong = ref<SongListType[]>([]);
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
const singerList = ref<SingerListType[]>([]);
const artMv = ref<MvType[]>([]);
const albumMore = ref(true);
let albumOffset = 0;

// 判断时候登录 如果未登录 相似歌手无法读取
const checkedClick = (pane: TabsPaneContext) => {
    if (pane.paneName == 'like' && !play.getIsLogin) {
        router.push({ name: 'login' })
    }
}

// 跳转到mv详情
const turnMvDetail = (id: number) => {
    router.push({ name: 'mvdetail', query: { mvid: id } })
}

// 歌手详情
const artistDesc = async (id: number) => {
    try {
        const { briefDesc, introduction } = await getArtistDesc(id);
        artDesc.intro = introduction;
        artDesc.brief = briefDesc;
    } catch (e) {
        console.log(e, 'artist desc fail =====>');
    }
}

// 歌手描述
const artDetail = async (id: number) => {
    try {
        const { data } = await getArtistDetail(id);
        artDil.value = data.artist;
    } catch (e) {
        console.log(e, 'artist detail fail =====>');
    }
}
// 歌手50首热门歌曲
const singerHotsongs = async (id: number) => {
    try {
        delSong.value.splice(0, delSong.value.length);
        const { hotSongs } = await getArtists(id);
        delSong.value = useSong(hotSongs);
    } catch (e) {
        console.log(e, 'hot artists =====>');
    }
}

// 相似歌手 需要登陆
const simiArtist = async (id: number) => {
    try {
        const { artists } = await getSimiArtist(id);
        singerList.value = artists;
    } catch (e) {
        console.log(e, 'simi artist fail =====>');
    }
}

const singerMv = async (id: number) => {
    try {
        const { mvs } = await getArtistMv(id, 12);
        artMv.value.splice(0, artMv.value.length);
        artMv.value = useMv(mvs);
    }
    catch (e) {
        console.log(e, 'artist mv fail =====>')
    }
}

// 歌手专辑 
const ArtistAlbum = async (id: number) => {
    if (albumMore.value) {
        try {
            const { hotAlbums, more } = await getArtistAlbum(id, 30, albumOffset);
            artAlbum.value = artAlbum.value.concat(hotAlbums);
            albumMore.value = more;
            albumOffset += 30;
        } catch (e) {
            console.log(e, 'artist album fail =====>');
        }
    }
}
const loadScroll = () => {
    if (checkedname.value !== 'album') return;
    ArtistAlbum(singerId.value);
}

const playIdx = (index: number) => {
    const songArr = JSON.parse(JSON.stringify(delSong.value));
    play.selectPlay(songArr, index);
}

const resetAlbun = () => {
    albumOffset = 0; // 重置专辑偏移值
    artAlbum.value.splice(0, artAlbum.value.length); // 切换歌手时 清空专辑拼接
    checkedname.value = 'hot'; // 切换歌手id时 切换到第一个页面
}

// 整体方法执行 
const changeSingerId = (id: number) => {
    resetAlbun(); // 这个方法的调用必须在ArtistAlbum方法之前
    artistDesc(id);
    artDetail(id);
    singerHotsongs(id);
    simiArtist(id);
    ArtistAlbum(id);
    singerMv(id);
}

watch(() => route.query.singerid, (id) => {
    if (!id) return;
    const singerid = id as unknown as number;
    singerId.value = singerid;
    changeSingerId(singerid);
}, { immediate: true });

</script>
<style lang='scss' scoped>
.singer-details {
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: #fff;
    margin: 20px 0;
    border-radius: 10px;

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