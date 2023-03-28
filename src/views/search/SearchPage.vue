<template>
    <div class="search-page">
        我是搜索歌曲页面
        <div class="module-checked">
            <el-tabs v-model="checkedname" type="card" class="demo-tabs" @tab-click="search">
                <el-tab-pane label="单曲" name="songs">
                    <SongList v-if="songsList?.length" :sheetList="songsList"></SongList>
                </el-tab-pane>
                <el-tab-pane label="专辑" name="albums">
                    <SingerAlbum v-if="artAlbum?.length" :data="artAlbum"></SingerAlbum>
                </el-tab-pane>
                <el-tab-pane label="歌手" name="artists">
                    <SingerSheet v-if="singerList?.length" :singer-list="singerList"></SingerSheet>
                </el-tab-pane>
                <el-tab-pane label="歌单" name="playlists">
                    <SongSheetCard v-if="sheetList?.length" :sheet="sheetList"></SongSheetCard>
                </el-tab-pane>
                <el-tab-pane label="MV" name="mv">
                    <MvList v-if="artMv.length" :list="artMv"></MvList>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script lang='ts' setup>
import { watch, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { getSearchSong, getSongDetail } from '@/api';
import { useSong, useMv, MvType } from '@/util';
import type { SongList as SongListType, SingerAlbumType, RecommendList, SingerListType, TagSearch } from '@/models'
import SongList from '@/components/song-sheet/SongList.vue';
import SingerAlbum from '@/components/singer/SingerAlbum.vue';
import SingerSheet from '@/components/singer/SingerSheet.vue';
import SongSheetCard from '@/components/song-sheet/SongSheetCard.vue';
import MvList from '@/components/mv/MvList.vue';
const route = useRoute();
const loading = ref<boolean>(false);

const checkedname = ref<string>('hot');
const params = {
    keywords: '海阔天空',
    limit: 30,
    offset: 0,
    type: 1 // 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单,  1004: MV
}
const searchType: TagSearch<number> = {
    songs: 1,
    albums: 10,
    artists: 100,
    playlists: 1000,
    mv: 1004,
}

const songsList = ref<SongListType[]>([]);
const artAlbum = ref<SingerAlbumType[]>([]);
const singerList = ref<SingerListType[]>();
const sheetList = ref<RecommendList[]>();
const artMv = ref<MvType[]>([]);

const search = (name: { paneName: string }) => {
    const type = searchType[name.paneName as keyof TagSearch<number>]; // 输出
    params.type = type;
    getSearchSong(params).then(res => {
        if (res.code == 200) {
            switch (type) {
                case 1:
                    const songs = res.result.songs;
                    const keys: string[] = [];
                    songs.forEach((item: { id: string }) => {
                        keys.push(item.id)
                    });
                    getSong(keys);
                    break;
                case 10:
                    artAlbum.value = res.result.albums;
                    break;
                case 100:
                    singerList.value = res.result.artists;
                    break;
                case 1000:
                    sheetList.value = res.result.playlists;
                    break;
                case 1004:
                    artMv.value = useMv(res.result.mvs);
                    break;
            }
        }
    })
};

const getSong = async (keys: string[]) => {
    loading.value = true;
    const timestamp = new Date().getTime();
    let ids = keys.join(',');
    try {
        const { songs } = await getSongDetail(ids, timestamp);
        songsList.value = songs.map((item: SongListType) => {
            if (item.id) {
                return useSong(item);
            }
        })
    } catch (e) {
        console.log(e, '获取单曲失败');
    }
}


watch(() => route.query.searchWord, async (current) => {
    const key = current as unknown as string;
    if (current) {
        params.keywords = key;
    }
}, { immediate: true });
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