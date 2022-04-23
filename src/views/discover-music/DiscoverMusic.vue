<template>
    <div class="discover-music">
        <div class="scroll">
            <RecommendScroll></RecommendScroll>
        </div>
        <div class="song">
            <RecommendNew></RecommendNew>
        </div>
        <div class="sheet">
            <RecommendSheet></RecommendSheet>
        </div>
        <div class="singer">
            <RecommendSinger></RecommendSinger>
        </div>
        <div class="mv">
            <RecommendMv></RecommendMv>
        </div>
    </div>
</template>

<script lang="ts" setup>
//可以不导入 会自动导入 但是导入了比较好跳转
import RecommendNew from '@/components/my-discover/RecommendNew.vue';
import RecommendSheet from '@/components/my-discover/RecommendSheet.vue';
import RecommendSinger from '@/components/my-discover/RecommendSinger.vue';
import RecommendMv from '@/components/my-discover/RecommendMv.vue';
import RecommendScroll from '@/components/my-discover/RecommendScroll.vue'
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