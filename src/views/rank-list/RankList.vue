
<template>
    <div class="ran-list">
        <div class="module-gap">
            <listmodule head="官方特色榜" gapColor="red">
                <SongSheet :sheet="mainSheetRank" textdir="center"></SongSheet>
            </listmodule>
        </div>
        <div class="module-gap">
            <list-module head="全球媒体榜" gapColor="blue">
                <SongSheet :sheet="otherSheetRank"></SongSheet>
            </list-module>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onMounted } from 'vue';
import { getToplist, getToplistDetail, getToplistDetailAll, getPlaylistTrackAll } from '@/api/http/api';
import { RecommendList } from '@/models/detail';
import SongSheet from '@/components/common/SongSheet.vue';
import listmodule from '@/components/common/listmodule.vue';

const sheetType = reactive({
    mainSheetRank: [] as RecommendList[],
    otherSheetRank: [] as RecommendList[],
})
const { mainSheetRank, otherSheetRank } = toRefs(sheetType);

async function getToplistMsg() {
    try {
        const { list } = await getToplist();
        mainSheetRank.value = list.slice(0, 4);
        otherSheetRank.value = list.slice(4, list.length);
    }
    catch (e) {
        console.log('请求失败', e)
    }
}

onMounted(getToplistMsg)
</script>

<style lang="scss" scoped>

.module-gap {
    margin: 20px 0px;
}
</style>