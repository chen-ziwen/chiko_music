
<template>
    <div class="ran-list">
        <div class="module-gap">
            <list-module head="官方特色榜" gapColor="red">
                <RankShow :rank-sheet="mainSheetRank" @sheetid="sheetID"></RankShow>
            </list-module>
        </div>
        <div class="module-gap">
            <list-module head="全球媒体榜" gapColor="blue">
                <SongSheet :sheet="otherSheetRank" textdir="center" :item="7" :back-show="false"></SongSheet>
            </list-module>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, onMounted } from 'vue';
import { getToplist, getPlaylistTrackAll } from '@/api/http/api';
import { RecommendList } from '@/models/detail';
import SongSheet from '@/components/song-sheet/SongSheet.vue';
import ListModule from '@/components/common/ListModule.vue';
import RankShow from '@/components/rank/RankShow.vue';
import { usePlay } from '@/store/play';
import { useSong } from "@/hook";

const sheetType = reactive({
    mainSheetRank: [] as RecommendList[],
    otherSheetRank: [] as RecommendList[],
})
const { mainSheetRank, otherSheetRank } = toRefs(sheetType);
const delSong = reactive<Record<string, any>[]>([]);
const play = usePlay();

async function getToplistMsg() {
    try {
        const { list } = await getToplist();
        const idList: number[] = [];
        let index = 0;
        mainSheetRank.value = list.slice(0, 4);
        otherSheetRank.value = list.slice(4, list.length);
        while (index < mainSheetRank.value.length) {
            idList.push(list[index].id)
            index++;
        }
        // 利用promise.all一次性请求
        const result = await Promise.all(idList.map(async ids => {
            const time = new Date().getTime();
            const res = await getPlaylistTrackAll(ids, 5, undefined, time);
            return res.songs; // 拿到songs列表
        }))

        for (let i = 0; i < result.length; i++) {
            mainSheetRank.value[i].songList = [];// 初始化数组
            const newsong = result[i].slice(0, 5); // 切割出5条数据
            for (let j = 0; j < newsong.length; j++) {
                mainSheetRank.value[i].songList[j] = useSong(newsong[j]); // 每一条数据都处理一下
                mainSheetRank.value[i].songList[j].index = j + 1; // 加入索引值
            }
        }
    }
    catch (e) {
        console.log('请求失败', e)
    }
}


// 当点击不同歌单时，得重新赋值歌单列表
const sheetID = async (id: number, index: number) => {
    delSong.length = 0;
    let i = 0;
    let nowTime = new Date().getTime();
    const { songs } = await getPlaylistTrackAll(id, undefined, undefined, nowTime);
    while (i < songs.length) {
        songs[i].index = i;
        delSong.push(useSong(songs[i])) // 将数据进行过滤和处理
        i++;
    }

    const songArr = JSON.parse(JSON.stringify(delSong));
    play.$patch({
        currentindex: index,
        playList: songArr,
    })
}
onMounted(getToplistMsg)
</script>

<style lang="scss" scoped>
.module-gap {
    margin: 20px 0px;
}
</style>