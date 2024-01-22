<template>
    <div class="discover-music">
        <!-- banner 轮播图 -->
        <div class="scroll">
            <Carousel />
        </div>
        <!-- 歌曲 -->
        <div class="song">
            <ContentBox title="新歌首发" back="#ffffff">
                <NewSongSheet :new-sheet="delSong" v-if="delSong.length" />
                <Loading v-else />
            </ContentBox>
        </div>
        <!-- 歌单 -->
        <div class="sheet" v-if="sheetlist">
            <ContentBox title="推荐歌单" back="#ffffff">
                <SongSheetCard :sheet="sheetlist" :backShow="false" :item="8" v-if="sheetlist.length" />
                <Loading v-else />
            </ContentBox>
        </div>
        <!-- 歌手 -->
        <div class="singer">
            <ContentBox title="推荐歌手" back="#ffffff">
                <SingerSheet :singer-list="artist" v-if="artist.length" />
                <Loading v-else />
            </ContentBox>
        </div>
        <!-- MV -->
        <div class="mv">
            <ContentBox title="推荐MV" back="#ffffff">
                <MvSheet :mv-sheet="recommendMv" v-if="recommendMv.length" />
                <Loading v-else />
            </ContentBox>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import Carousel from "@/components/discover-music/Carousel.vue";
import ContentBox from "@/components/common/ContentBox.vue";
import SongSheetCard from "@/components/song-sheet/SongSheetCard.vue";
import SingerSheet from "@/components/singer/SingerSheet.vue";
import NewSongSheet from "@/components/new-disc/NewSongSheet.vue";
import MvSheet from "@/components/mv/MvSheet.vue";
import { getRecommendList, getSongDetail, getTopArtists, getPersonalizedNewsong, getPersonalizedMv, getVipInfo } from '@/api/http/api';
import type { RecommendList, SingerListType, SongList } from "@/models";
import { useSong } from "@/util";
import Loading from "@/components/common/loading/Loading.vue";

const sheetlist = ref<RecommendList[]>([]);
const artist = ref<SingerListType[]>([]);
const delSong = ref<SongList[]>([]);
const recommendMv = ref<any[]>([]);

async function getRecommend() {
    let { result } = await getRecommendList(32);
    sheetlist.value = result;
}

async function topArtists() {
    let { artists } = await getTopArtists(40);
    artist.value = artists;
}

function Personalized() {
    getPersonalizedNewsong(12).then(res => {
        const ids = res.result.map((x: SongList) => x.id).join(",");
        SongDetail(ids);
    }).catch((e) => {
        console.error(e, 'new song fail =====>');
    });
}

const SongDetail = (ids: string) => {
    getSongDetail(ids).then(res => {
        delSong.value = useSong(res.songs);
    }).catch((e) => {
        console.error(e, 'song list fail =====>');
    });
}

async function PersonalizedMv() {
    let { result } = await getPersonalizedMv();
    recommendMv.value = result;
}

getVipInfo().then(data => {
    console.log('vip info', data);
})

onMounted(() => {
    getRecommend();
    topArtists();
    Personalized();
    PersonalizedMv();
});
</script>

<style lang="scss" scoped>
.scroll,
.sheet,
.singer,
.song,
.mv {
    margin-bottom: 60px;
}

.song {
    margin-top: 80px;
}
</style>