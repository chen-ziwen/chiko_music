<template>
    <div class="search-page">
        我是搜索歌曲页面
    </div>
</template>
<script lang='ts' setup>
import { watch } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();





watch(() => route.query.searchWord, (current) => {
    console.log('current', current);
}, { immediate: true })
</script>
<style lang='scss' scoped></style>