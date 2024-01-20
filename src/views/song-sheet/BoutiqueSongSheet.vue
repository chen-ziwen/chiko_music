<template>
    <div class="boutique-song-list">
        <div class="module-gap">
            <ContentBox title="精品歌单" back="#ffffff">
                <span class="high-tags" @click.stop="showPop = !showPop">
                    <i class="iconfont icon-xiangxia" :style="{ marginRight: '3px' }"></i>{{ nameId }}
                </span>
                <Transition name="pop">
                    <ul class="boutique-list" v-if="showPop" v-close-outside="() => showPop = false">
                        <li class="boutique-tag" v-for="name of boutique" :key="name" @click="tSheet(name)">
                            <span class="checked-tag" :class="light(name)">{{ name }}</span>
                        </li>
                    </ul>
                </Transition>
                <LoadScroll @load-scorll="loadScroll" :distance="100">
                    <template v-if="sheetList.playlists">
                        <BoutiqueSongSheetCard ref="scroll" :sheet="sheetList.playlists" :back-show="false" :item="3" />
                        <Loading v-if="sheetList.more" :min-height="80" />
                    </template>
                    <Loading v-else />
                </LoadScroll>
            </ContentBox>
        </div>
    </div>
</template>
<script lang='ts' setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { LocationQueryValue, useRoute } from 'vue-router';
import { getHighquality, getHighQualityTags } from '@/api/http/api'
import ContentBox from '@/components/common/ContentBox.vue';
import LoadScroll from '@/components/common/LoadScroll.vue';
import Loading from '@/components/common/loading/Loading.vue';
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
const nameId = ref<string>('');
const showPop = ref<boolean>(false);
const scroll = ref<any>(null);
const sheetList = reactive<{ playlists: any[], more: boolean }>({
    playlists: [],
    more: true,
})

const light = (name: string) => name == nameId.value ? 'hight-light' : "";

const boutiqueTags = async () => {
    try {
        const { tags } = await getHighQualityTags();
        boutique.value = tags.map((x: BoutiqueTags) => x.name);
    } catch (e) {
        console.error(e, 'tags fail =====>')
    }
}

const tSheet = async (name: string) => {
    try {
        const { more, playlists } = await getHighquality(name, 30);
        sheetList.playlists = playlists;
        sheetList.more = more;
        nameId.value = name;
        showPop.value = false;
    } catch (e) {
        console.error(e, 'song list fail =====>')
    }
}

const loadScroll = async () => {
    const updatetime = sheetList.playlists[sheetList.playlists.length - 1]?.updateTime || 0;
    if (sheetList.more) {
        try {
            const { playlists, more } = await getHighquality(nameId.value, 30, updatetime);
            sheetList.playlists.push(...playlists);
            sheetList.more = more;
        } catch (e) {
            console.error(e, 'song list fail =====>')
        }
    }
}

watch(() => route.query.name, async (name) => {
    if (!name) return;
    await tSheet(<string>name);
    nameId.value = <string>name;
}, { immediate: true })

onMounted(boutiqueTags);

</script>
<style lang='scss' scoped>
.boutique-song-list {
    position: relative;

    .module-gap {
        position: relative;
        padding: 20px 0;
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
            border: 1px solid #BCB7B7;
            border-radius: 20px;
            color: rgb(44, 44, 44);
            cursor: pointer;

            &:hover {
                background-color: #ffe1ed;
                color: #f86262;
                border-color: #f86262;
            }
        }
    }

    .boutique-list {
        position: absolute;
        right: 10px;
        top: 75px;
        width: 550px;
        z-index: 99;
        background-color: #ffffff;
        box-shadow: 0 0 5px #4f4f4f;
        border-radius: 15px;

        .boutique-tag {
            display: inline-block;
            width: calc(20% - 10px);
            text-align: center;
            overflow: hidden;
            margin: 10px 5px;
            color: #383838;

            .checked-tag {
                display: inline-block;
                padding: 3px 10px;
                cursor: pointer;
            }
        }

    }
}

.hight-light {
    border-radius: 3px;
    background-color: rgb(245, 204, 211);
    color: #F84E4E;
}
</style>