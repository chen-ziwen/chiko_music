<template>
    <div class="discover-music">
        <!-- banner 轮播图 -->
        <div class="scroll">
            <RecommendScroll></RecommendScroll>
        </div>
        <!-- 歌曲 -->
        <div class="song">
            <RecommendNew></RecommendNew>
        </div>
        <!-- 歌单 -->
        <div class="sheet" v-if="sheetlist">
            <!-- 当sheet不为undefined时才渲染 -->
            <RecommendSheet :sheetList="sheetlist" titlename="推荐歌单"></RecommendSheet>
        </div>
        <!-- 歌手 -->
        <div class="singer">
            <RecommendSinger></RecommendSinger>
        </div>
        <!-- MV -->
        <div class="mv">
            <RecommendMv></RecommendMv>
        </div>
    </div>
</template>

<script lang="ts" setup>
//可以不导入 会自动导入 但是导入了比较好跳转
import { onMounted, reactive, ref } from "vue";
import RecommendNew from '@/components/my-discover/RecommendNew.vue';
import RecommendSheet from '@/components/my-discover/RecommendSheet.vue';
import RecommendSinger from '@/components/my-discover/RecommendSinger.vue';
import RecommendMv from '@/components/my-discover/RecommendMv.vue';
import RecommendScroll from '@/components/my-discover/RecommendScroll.vue';
import type { RecommendList } from "@/models/detail";
import { getRecommendList } from '@/api/http/api';

const sheetlist = ref<RecommendList[]>();
async function getRecommend() {
    let { result } = await getRecommendList(32);
    sheetlist.value = result;
}
onMounted(() => { getRecommend() });
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