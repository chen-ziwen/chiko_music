<template>
    <div class="discover-music">
        <!-- banner 轮播图 -->
        <div class="scroll">
            <RecommendScroll></RecommendScroll>
        </div>
        <!-- 歌曲 -->
        <div class="song">
            <Recommend title="新歌首发">
                <template v-if="newsong&&newsong.length>0">
                    <NewSongSheet :new-sheet="newsong"></NewSongSheet>
                </template>
            </Recommend>
        </div>
        <!-- 歌单 -->
        <div class="sheet" v-if="sheetlist">
            <Recommend title="推荐歌单">
                <template v-if="sheetlist&&sheetlist.length>0">
                    <SongSheet :sheet="sheetlist"></SongSheet>
                </template>
            </Recommend>
        </div>
        <!-- 歌手 -->
        <div class="singer">
            <Recommend title="推荐歌手">
                <template v-if="artist&&artist.length>0">
                    <SingerSheet :singer-list="artist"></SingerSheet>
                </template>
            </Recommend>
        </div>
        <!-- MV -->
        <div class="mv">
            <Recommend title="推荐MV">
                <template v-if="recommendMv&&recommendMv.length>0">
                    <MvSheet :mv-sheet="recommendMv"></MvSheet>
                </template>
            </Recommend>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import RecommendScroll from '@/components/my-discover/RecommendScroll.vue';
import Recommend from "@/components/my-discover/Recommend.vue";
import SongSheet from "@/components/common/SongSheet.vue";
import SingerSheet from "@/components/common/SingerSheet.vue";
import NewSongSheet from "@/components/common/NewSongSheet.vue";
import MvSheet from "@/components/common/MvSheet.vue";
import { getRecommendList, getTopArtists, getPersonalizedNewsong, getPersonalizedMv } from '@/api/http/api';
import type { RecommendList, TopArtists, Newsong } from "@/models/detail";

const sheetlist = ref<RecommendList[]>();
const artist = ref<TopArtists[]>();
const newsong = ref<Newsong[]>();
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
        newsong.value = res.result;
    });
}
async function PersonalizedMv() {
    let { result } = await getPersonalizedMv();
    recommendMv.value = result
};

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
    margin-bottom: 30px;
}
</style>