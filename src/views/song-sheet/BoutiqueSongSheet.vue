<template>
    <div class="boutique-song-list">
        <div class="module-gap">
            <ListModule head="精品歌单" gap-color="red" gap-height="35px">
                <ul class="boutique-list">
                    <li v-for="(tag, index) of boutique" @click="turnSheet(tag.name)">
                        {{ tag.name }}
                    </li>
                </ul>
                <SongSheet :sheet="boSheet.playlists" :back-show="false"></SongSheet>
            </ListModule>
        </div>
    </div>
</template>
<script lang='ts' setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getHighquality, getHighQualityTags } from '@/api/http/api'
import ListModule from '@/components/common/ListModule.vue';
import SongSheet from '@/components/common/SongSheet.vue';

interface BoutiqueTags {
    id: number;
    name: string;
    type: number;
    category: number;
    hot: boolean;
}

const route = useRoute();
const boutique = ref<BoutiqueTags[]>([]) // 精品歌单标签
const boSheet = reactive({
    playlists: [],
    total: 0,
    lasttime: 0,
    more: false,
})
const boutiqueTags = async () => {
    try {
        const { tags } = await getHighQualityTags();
        boutique.value = tags;
    } catch (e) {
        console.log(e, '精品标签请求失败')
    }
}

const turnSheet = async (name: string) => {
    try {
        const { lasttime, more, playlists, total } = await getHighquality(name, 30)
        boSheet.playlists = playlists;
        boSheet.lasttime = lasttime;
        boSheet.more = more;
        boSheet.total = total;
    }
    catch (e) {
        console.log(e, '精歌单请求失败')
    }
}

watch(() => route.query.name, () => {
    const name = route.query.name as string;
    if (name) {
        turnSheet(name)
    }
})

onMounted(async () => {
    await boutiqueTags();
})

</script>
<style lang='scss' scoped>

.boutique-song-list {
    // width: 500px;
    // height: 500px;
    // background-color: red;
    .module-gap {
    margin: 20px 0px;
    &:deep(.list-head) {
        font-weight: 700;
        font-size: 24px;
    }
 }
 .boutique-list {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    li {
        cursor: pointer;
    }
 }
}
</style>