<template>
    <div class="search-page">
        我是搜索歌曲页面
        {{ result }}
    </div>
</template>
<script lang='ts' setup>
import { watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getSearchSong } from '@/api';
const route = useRoute();

const params = {
    keywords: '海阔天空',
    limit: 100,
    offset: 0,
    type: 1 // 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单,  1004: MV
}

const result = ref<any>();

// 获取搜索歌曲
const useGetSearchSong = async () => {
    try {
        const { result } = await getSearchSong(params);
        result.value = result;
        console.log('result', result);
    } catch (e) {
        console.log(e);
    }
}

watch(() => route.query.searchWord, (current) => {
    const key = current as unknown as any;
    if (current) {
        console.log('chufale1', key);

        params.keywords = key;
        useGetSearchSong();
    }
}, { immediate: true })
</script>
<style lang='scss' scoped></style>