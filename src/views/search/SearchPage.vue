<template>
    <div class="search-page">
        我是搜索歌曲页面
        <div class="module-checked">
            <el-tabs v-model="checkedname" type="card" class="demo-tabs" @tab-click="checkedClick">
                <el-tab-pane label="单曲" name="songs">
                    <!-- <SongList v-if="delSong.length" :sheetList="delSong" @keeplist="keepsheet"></SongList> -->
                </el-tab-pane>
                <el-tab-pane label="专辑" name="albums">
                    <!-- <SingerAlbum v-if="artAlbum.length" :data="artAlbum"></SingerAlbum> -->
                </el-tab-pane>
                <el-tab-pane label="歌手" name="artists">
                    <!-- <SingerMsg v-if="artDesc.intro.length" :data="artDesc.intro" :text="artDesc.brief"></SingerMsg> -->
                </el-tab-pane>
                <el-tab-pane label="歌单" name="playlists">
                    <!-- <SingerMsg v-if="artDesc.intro.length" :data="artDesc.intro" :text="artDesc.brief"></SingerMsg> -->
                </el-tab-pane>
                <el-tab-pane label="MV" name="mv">
                    <!-- <MvList v-if="artMv.length" :list="artMv" @mvid="turnMvDetail"></MvList> -->
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script lang='ts' setup>
import { watch, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { getSearchSong } from '@/api';
import { useSong, useMv, MvType } from '@/util';
import type { SingerDetail, SongList as SongListType, SingerAlbumType, SingerListType, TagSearch } from '@/models'
import SingerMsg from '@/components/singer/SingerMsg.vue';
import SongList from '@/components/song-sheet/SongList.vue';
import SingerAlbum from '@/components/singer/SingerAlbum.vue';
import SingerSheet from '@/components/singer/SingerSheet.vue';
import MvList from '@/components/mv/MvList.vue';
const route = useRoute();

const checkedname = ref<string>('hot');
const params = {
    keywords: '海阔天空',
    limit: 30,
    offset: 0,
    type: 1 // 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单,  1004: MV
}
const searchType: TagSearch<number> = {
    albums: 10,
    songs: 1,
    artists: 100,
    playlists: 1000,
    mv: 1004,
}

const songs = reactive<SongListType[]>([]);
const artDesc: { intro: [], brief: string } = reactive({ intro: [], brief: '暂无数据' });
const artAlbum = ref<SingerAlbumType[]>([]);
const singerList = ref<SingerListType[]>();
const artMv = ref<MvType[]>([]);

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

const checkedClick = (name: { paneName: string }) => {
    const tag = searchType[name.paneName as keyof TagSearch<number>]; // 输出
    switch (tag) {
        case 1:
            break;
        case 10:
            break;
        case 100:
            break;
        case 1000:
            break;
        case 1004:
            break;
    }
}

watch(() => route.query.searchWord, async (current) => {
    const key = current as unknown as any;
    if (current) {
        params.keywords = key;
        await useGetSearchSong();
    }
}, { immediate: true })
</script>
<style lang='scss' scoped>
.module-checked {
    margin: 15px 30px;
    background-color: #ffffff;

    &:deep(.el-tabs) {
        --el-color-primary: #f87a8f;
    }
}
</style>