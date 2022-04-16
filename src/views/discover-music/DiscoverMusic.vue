<template>
    <div class="discover-music">
        <div class="sheet">
            <RecommendSheet></RecommendSheet>
        </div>
        <div class="singer">
            <RecommendSinger></RecommendSinger>
        </div>
    </div>
</template>

<script lang="ts" setup>
// import RecommendSheet from '@/components/my-discover/RecommendSheet.vue';
// import RecommendSinger from '@/components/my-discover/RecommendSinger.vue'

</script>

<style lang="scss" scoped>
.sheet,
.singer {
    margin-bottom: 30px;
}
</style>