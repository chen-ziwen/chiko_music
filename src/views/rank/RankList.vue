
<template>
    <div class="ran-list">
        <div class="module-gap">
            <ListModule head="官方特色榜" gapColor="red">
                <RankShow :rank-sheet="sheet.mainSheetRank" @sheetid="playSong"></RankShow>
            </ListModule>
        </div>
        <div class="module-gap">
            <ListModule head="全球媒体榜" gapColor="blue">
                <SongSheetCard :sheet="sheet.otherSheetRank" textdir="center" :item="7" :back-show="false"></SongSheetCard>
            </ListModule>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
import { getToplist, getPlaylistTrackAll } from '@/api/http/api';
import { RecommendList } from '@/models/detail';
import SongSheetCard from '@/components/song-sheet/SongSheetCard.vue';
import ListModule from '@/components/common/ListModule.vue';
import RankShow from '@/components/rank/RankShow.vue';
import { usePlay } from '@/store/play';
import { useSong } from "@/util";

const sheet = reactive({
    mainSheetRank: [] as RecommendList[],
    otherSheetRank: [] as RecommendList[],
})
const play = usePlay();

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
    } catch (e) {
        console.log(e, 'request fail =====>');
    }
}

const playSong = async (index: number, order: number) => {
    const songList = sheet.mainSheetRank[index].songList;
    play.$patch({
        currentindex: order,
        playList: songList,
    })
}

onMounted(getToplistMsg);
</script>

<style lang="scss" scoped>
.module-gap {
    margin: 20px 0px;
}
</style>