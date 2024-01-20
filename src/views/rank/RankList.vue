
<template>
    <div class="ran-list">
        <div class="module-gap">
            <ListModule head="官方特色榜" gapColor="red">
                <RankShow :rank-sheet="sheet.mainSheetRank" :loading="loading" @sheetid="playSong" />
            </ListModule>
        </div>
        <div class="module-gap">
            <ListModule head="全球媒体榜" gapColor="blue">
                <template v-if="sheet.otherSheetRank.length">
                    <SongSheetCard :sheet="sheet.otherSheetRank" textdir="center" :item="7" :back-show="false" />
                </template>
                <Loading v-else />
            </ListModule>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue';
import { getToplist, getPlaylistTrackAll } from '@/api/http/api';
import { RecommendList } from '@/models/detail';
import SongSheetCard from '@/components/song-sheet/SongSheetCard.vue';
import ListModule from '@/components/common/ListModule.vue';
import RankShow from '@/components/rank/RankShow.vue';
import Loading from '@/components/common/loading/Loading.vue';
import { usePlay } from '@/store/play';
import { useSong } from "@/util";

const sheet = reactive({
    mainSheetRank: [] as RecommendList[],
    otherSheetRank: [] as RecommendList[],
})
const play = usePlay();
const loading = ref(true);

async function getToplistMsg() {
    try {
        const { list } = await getToplist();
        sheet.mainSheetRank = list.slice(0, 4);
        sheet.otherSheetRank = list.slice(4, list.length);
        const ids = sheet.mainSheetRank.map((_, index) => list[index].id);
        const result = await Promise.all(ids.map(async ids => {
            const res = await getPlaylistTrackAll(ids, 5, undefined, Date.now());
            return res.songs;
        }));
        for (let i = 0; i < result.length; i++) {
            sheet.mainSheetRank[i].songList = [];
            const rankShow = result[i].slice(0, 5);
            sheet.mainSheetRank[i].songList = useSong(rankShow);
        }
        loading.value = false;
    } catch (e) {
        console.error(e, 'request fail =====>');
    }
}

const playSong = async (index: number, order: number) => {
    const songList = sheet.mainSheetRank[index].songList;
    play.selectPlay(songList, order);
}

onMounted(getToplistMsg);
</script>

<style lang="scss" scoped>
.module-gap {
    margin: 20px 0px;
}
</style>