<template>
    <div class="search-page">
        <h2 class="search-words">搜索关键词：{{ params.keywords }}</h2>
        <div class="module-checked">
            <el-tabs v-model="checkedname" class="demo-tabs" @tab-click="search">
                <el-tab-pane label="单曲" name="songs">
                    <SongList v-if="songsList?.length" :sheetList="songsList" @playIdx="playIdx"></SongList>
                </el-tab-pane>
                <el-tab-pane label="专辑" name="albums">
                    <SingerAlbum v-if="artAlbum?.length" :data="artAlbum"></SingerAlbum>
                </el-tab-pane>
                <el-tab-pane label="歌手" name="artists">
                    <SingerSheet v-if="singerList?.length" :singer-list="singerList" type="square"></SingerSheet>
                </el-tab-pane>
                <el-tab-pane label="歌单" name="playlists">
                    <SongSheetCard v-if="sheetList?.length" :sheet="sheetList" :back-show="false"></SongSheetCard>
                </el-tab-pane>
                <el-tab-pane label="MV" name="mv">
                    <MvList v-if="artMv.length" :list="artMv" @mvid="turnMvDetail"></MvList>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script lang='ts' setup>
import { watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePlay } from '@/store/play';
import { getSearchSong, getSongDetail } from '@/api';
import { useSong, useMv, MvType } from '@/util';
import type { SongList as SongListType, SingerAlbumType, RecommendList, SingerListType, TagSearch } from '@/models'
import { TabsPaneContext } from 'element-plus';
import SongList from '@/components/song-sheet/SongList.vue';
import SingerAlbum from '@/components/singer/SingerAlbum.vue';
import SingerSheet from '@/components/singer/SingerSheet.vue';
import SongSheetCard from '@/components/song-sheet/SongSheetCard.vue';
import MvList from '@/components/mv/MvList.vue';
const route = useRoute();
const router = useRouter();
const play = usePlay();

const checkedname = ref<string>('songs');
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

const search = (pane: Partial<TabsPaneContext>) => {
    const type = searchType[pane.paneName as keyof TagSearch<number>];
    params.type = type;
    getSearchSong(params).then(res => {
        if (res.code == 200) {
            switch (type) {
                case 1:
                    const keys = res.result.songs.map((item: { id: string }) => item.id);
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
    try {
        const { songs } = await getSongDetail(keys.join(','), Date.now());
        songsList.value = useSong(songs)
    } catch (e) {
        console.log(e, 'song detail fail =====>');
    }
};

const playIdx = (index: number) => {
    const songArr = JSON.parse(JSON.stringify(songsList.value));
    play.selectPlay(songArr, index);
};

const turnMvDetail = (id: number) => {
    router.push({ name: 'mvdetail', query: { mvid: id } })
};

watch(() => route.query.searchWord, async (current) => {
    const key = current as unknown as string;
    if (current) {
        checkedname.value = 'songs'; // 搜索关键词改变时，回到第一页
        params.keywords = key;
        search({ paneName: 'songs' });
    }
}, { immediate: true });

</script>
<style lang='scss' scoped>
.search-page {
    .search-words {
        margin: 25px 0;
    }

    .module-checked {
        &:deep(.el-tabs) {
            --el-color-primary: #f87a8f;
            --el-border-color-light: transparent;

            .el-tabs__header {
                margin: 0 !important;
                background-color: $color;
            }
        }
    }

}
</style>