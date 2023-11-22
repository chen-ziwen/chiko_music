<template>
    <div class="discover-music">
        <!-- banner 轮播图 -->
        <div class="scroll">
            <Carousel></Carousel>
        </div>
        <!-- 歌曲 -->
        <div class="song">
            <ContentBox title="新歌首发" back="#ffffff">
                <template v-if="delSong && delSong.length > 0">
                    <NewSongSheet :new-sheet="delSong"></NewSongSheet>
                </template>
            </ContentBox>
        </div>
        <!-- 歌单 -->
        <div class="sheet" v-if="sheetlist">
            <ContentBox title="推荐歌单" back="#ffffff">
                <template v-if="sheetlist && sheetlist.length > 0">
                    <SongSheetCard :sheet="sheetlist" :backShow="false" :item="8"></SongSheetCard>
                </template>
            </ContentBox>
        </div>
        <!-- 歌手 -->
        <div class="singer">
            <ContentBox title="推荐歌手" back="#ffffff">
                <template v-if="artist && artist.length > 0">
                    <SingerSheet :singer-list="artist"></SingerSheet>
                </template>
            </ContentBox>
        </div>
        <!-- MV -->
        <div class="mv">
            <ContentBox title="推荐MV" back="#ffffff">
                <template v-if="recommendMv && recommendMv.length > 0">
                    <MvSheet :mv-sheet="recommendMv"></MvSheet>
                </template>
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
import { getRecommendList, getSongDetail, getTopArtists, getPersonalizedNewsong, getPersonalizedMv } from '@/api/http/api';
import type { RecommendList, SingerListType, SongList } from "@/models";
import { useSong } from "@/util";

const sheetlist = ref<RecommendList[]>();
const artist = ref<SingerListType[]>();
const delSong = ref<SongList[]>();
const recommendMv = ref<any>();

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
        console.log(e, 'new song fail =====>');
    });
}

const SongDetail = (ids: string) => {
    getSongDetail(ids).then(res => {
        delSong.value = useSong(res.songs);
    }).catch((e) => {
        console.log(e, 'song list fail =====>');
    });
}

async function PersonalizedMv() {
    let { result } = await getPersonalizedMv();
    recommendMv.value = result;
}

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