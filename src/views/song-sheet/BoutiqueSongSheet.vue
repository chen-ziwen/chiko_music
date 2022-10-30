<template>
    <div class="boutique-song-list" @click="pop = false">
        <div class="module-gap">
            <ContentBox title="精品歌单">
                <span class="high-tags" @click.stop="pop = !pop">
                    <i class="iconfont icon-xiangxia" :style="{ marginRight: '3px' }"></i>
                    {{ nameKey }}
                </span>
                <Transition name="pop">
                    <ul class="boutique-list" v-if="pop">
                        <li class="boutique-tag" v-for="(name, index) of boutique" :key="index + name" @click="turnSheet(name)">
                            <span class="checked-tag" :class="hightlight(name)">{{ name }}</span>
                        </li>
                    </ul>
                </Transition>
                <BoutiqueSongSheetCard ref="scroll" @getscroll="scrollData" :sheet="boSheet.playlists" :back-show="false" :item="3"></BoutiqueSongSheetCard>
            </ContentBox>

        </div>
    </div>
</template>
<script lang='ts' setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getHighquality, getHighQualityTags } from '@/api/http/api'
import ContentBox from '@/components/common/ContentBox.vue';
import BoutiqueSongSheetCard from '@/components/song-sheet/BoutiqueSongSheetCard.vue';

interface BoutiqueTags {
    id: number;
    name: string;
    type: number;
    category: number;
    hot: boolean;
}

const route = useRoute();
const boutique = ref<string[]>([]) // 精品歌单标签
const nameKey = ref<string>('');
const pop = ref<boolean>(false);
const scroll = ref<any>(null);
const boSheet = reactive({
    playlists: [] as any[],
    total: 0,
    lasttime: 0,
    more: false,
})

const hightlight = (name: string) => {
    if (!nameKey.value) return;
    if (name == nameKey.value) {
        return 'hight-light';
    }
    return;
}

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
        // 精品歌单一般不超过100个 直接全部拿出来 懒得写分页了
        const { lasttime, more, playlists, total } = await getHighquality(name, 30);
        boSheet.playlists = playlists;
        boSheet.lasttime = lasttime;
        boSheet.more = more;
        boSheet.total = total;
        nameKey.value = name; // 选中高亮
        scroll.value.topWay() // 精品歌单置顶
    }
    catch (e) {
        console.log(e, '精歌单请求失败')
    }
}

const scrollData = async (time: number) => {
    try {
        const { playlists } = await getHighquality(nameKey.value, 30, time);
        boSheet.playlists.push(...playlists); // 滚动条到指定位置时，便将新请求到的数据推入到当前类别的数组中
    }
    catch (e) {
        console.log(e, '精歌单请求失败')
    }
}

watch(() => route.query.name, async (name) => {
    if (!name) return;
    await turnSheet(name as string);
    nameKey.value = name as string;
}, { immediate: true })

onMounted(() => {
    boutiqueTags();
})

</script>
<style lang='scss' scoped>

.boutique-song-list {
    position: relative;
    .module-gap {
    position: relative;
    padding: 10px 0;
    box-sizing: border-box;
    &:deep(.list-head) {
        font-weight: 700;
        font-size: 24px;
    }
    .high-tags {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 35px;
        right: 25px;
        padding: 3px 15px;
        border:1px solid #BCB7B7;
        border-radius: 20px;
        color: rgb(44,44,44);
        cursor: pointer;
        
    }
   
 }
 .boutique-list {
    position: absolute;
    right: 0;
    top:75px;
    width: 550px;
    z-index: 99;
    background-color: #F9FAFC;
    border-radius: 15px;
    .boutique-tag {
        display: inline-block;
        width: calc(20% - 10px);
        text-align: center;
        overflow: hidden;
        margin: 10px 5px;
        .checked-tag {
            display: inline-block;
            padding: 3px 10px;
            cursor: pointer;
        }
    }
   
 }
}

.hight-light {
    border-radius: 16px;
    background-color: #f9d8e5;
    color: #F84E4E;
}

</style>