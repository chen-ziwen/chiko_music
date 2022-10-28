<template>
    <div class="boutique-song-list">
        <div class="module-gap">
            <Recommend title="精品歌单">
                <ul class="boutique-list">
                    <li v-for="(name, index) of boutique" :key="index + name" @click="turnSheet(name)">
                        {{ name }}
                    </li>
                </ul>
                <SongSheet :sheet="boSheet.playlists" :back-show="false"></SongSheet>
            </Recommend>
        </div>
    </div>
</template>
<script lang='ts' setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getHighquality, getHighQualityTags } from '@/api/http/api'
import ListModule from '@/components/common/ListModule.vue';
import Recommend from '@/components/my-discover/Recommend.vue';
import SongSheet from '@/components/common/SongSheet.vue';

interface BoutiqueTags {
    id: number;
    name: string;
    type: number;
    category: number;
    hot: boolean;
}

const route = useRoute();
const boutique = ref<string[]>([]) // 精品歌单标签
const boSheet = reactive({
    playlists: [],
    total: 0,
    lasttime: 0,
    more: false,
})
const boutiqueTags = async () => {
    try {
        const { tags } = await getHighQualityTags();
        boutique.value = tags.map((x: BoutiqueTags) => x.name);
    } catch (e) {
        console.log(e, '精品标签请求失败')
    }
}

const turnSheet = async (name: string) => {
    try {
        const { lasttime, more, playlists, total } = await getHighquality(name, 30);
        boSheet.playlists = playlists;
        boSheet.lasttime = lasttime;
        boSheet.more = more;
        boSheet.total = total;
    }
    catch (e) {
        console.log(e, '精歌单请求失败')
    }
}

watch(() => route.query.name, (name) => {
    if (!name) return;
    turnSheet(name as string)
}, { immediate: true })

onMounted(() => {
    boutiqueTags();
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