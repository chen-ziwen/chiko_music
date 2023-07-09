<template>
    <div class="song-sheet" v-loading="!loading" element-loading-background="rgba(254,236,239, 1)">
        <div class="boutique" @click="boutique" v-if="!page?.none && loading">
            <div class="page-img-back" :style="{ backgroundImage: `url(${page.coverImgUrl})` }"></div>
            <div class="content-box">
                <img class="page-img" :src="page.coverImgUrl" />
                <div class="sheet-box">
                    <span class="sheet-type">
                        <i class="iconfont icon-huangguan"></i>
                        精品歌单</span>
                    <span class="sheet-desc">{{ page.name }}</span>
                    <span class="copy-writer">{{ page.copywriter }}</span>
                </div>
            </div>
        </div>
        <div class="sheet-module">
            <div class="sheet-tags-all">
                <div class="choose-key" @click.stop="pop = !pop">
                    {{ nameKey }}
                    <el-icon>
                        <ArrowDown />
                    </el-icon>
                </div>
                <ul class="sheet-list-tag">
                    <li class="sheet-hot-tag" v-for="name of hotTags" :class="hightlight(name)" @click="tagsList(name)">
                        {{ name }}
                    </li>
                </ul>
                <Transition name="pop">
                    <div class="tags-position" v-if="pop" v-close-outside="() => pop = false">
                        <div class="tags-type" v-for="(item, index) in allTags" :key="item.name + index">
                            <span class="tags-hight-light">{{ item.name }}</span>
                            <ul class="tags-common-type">
                                <li class="tags" v-for="data in item.list" :key="data.name" :class="hightlight(data.name)" @click="tagsList(data.name)">
                                    <span>{{ data.name }}<sup :style="{ fontSize: '10px' }">{{ data.hot ? "hot" : "" }}</sup></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Transition>
            </div>
            <SongSheetCard :sheet="sheetList.playlists" :item="8" :back-show="false"></SongSheetCard>
            <div v-if="sheetList.playlists.length">
                <el-pagination class="pagination" layout="prev, pager, next" background :total="sheetList.total || 0" :page-size="64" @current-change="currentChange" v-model:currentPage="currentPage" :hide-on-single-page="true" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getPlaylistHot, getTopPlaylistDetail, getPlaylistCatlist, getHighquality, getHighQualityTags } from '@/api/http/api';
import SongSheetCard from '@/components/song-sheet/SongSheetCard.vue';
import { ArrowDown } from '@element-plus/icons-vue';
import { onMounted, reactive, ref, watch, toRef, onActivated } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { scrollTop } from '@/util';
interface HotTags {
    id: number;
    name: string;
    type: number;
    category: number;
    hot: boolean;
}
interface AllTags {
    name: string;
    list: {
        name: string;
        type: number;
        category: number;
        hot: boolean;
    }[];
}
interface HightPage {
    coverImgUrl: string;
    name: string;
    none?: boolean,
    copywriter: string;
}

const hotTags = ref<string[]>([]); // 热门标签
const TopTags = ref<string[]>([]); //精品标签
const allTags = ref<AllTags[]>([]); // 全部标签
const loading = ref<boolean>(false);
const route = useRoute();
const router = useRouter();
const scroll = scrollTop();

const sheetList = reactive({
    playlists: [],
    total: 0
});
const hightSheet = reactive({
    page: {} as HightPage,
    hightlists: [],
    total: 0,
});

const currentPage = ref<number>(1);
const nameKey = ref<string>('');
const pop = ref<boolean>(false);
const page = toRef(hightSheet, "page");

const hightlight = (name: string) => {
    let cN = '';
    if (name == nameKey.value) {
        cN = 'hight-light';
    }
    return cN;
}

async function getTags() {
    const { tags } = await getPlaylistHot(); // 获取热门歌单标签
    hotTags.value = tags.map((x: HotTags) => x.name);
}

async function getTopTags() {
    const { tags } = await getHighQualityTags(); // 获取精品标签
    TopTags.value = tags.map((x: HotTags) => x.name); // 拿到精品标签数组
}

// 获取全部标签
async function getAllTags() {
    try {
        const { sub, categories } = await getPlaylistCatlist();
        let tagList: AllTags[] = [];
        // 对标签进行分类
        for (let item of sub) {
            const { name, hot, category, type } = item;
            let tags = { name, hot, category, type };
            if (!tagList[category]) {
                tagList[category] = { name: categories[category], list: [tags] }
            } else {
                tagList[category].list.push(tags);
            }
        }
        allTags.value = tagList;
    } catch (e) {
        console.log(e, '获取全部标签失败');
    }
}

// 全部标签选中
const tagsList = async (name: string) => {
    const { playlists, total } = await getTopPlaylistDetail(name, 64, 0);
    if (TopTags.value.includes(name)) {
        const res = await getHighquality(name, 1);
        page.value = res.playlists[0]; // 拿到歌单分类里的第一个歌单
    } else {
        page.value = { coverImgUrl: 'none', name: '暂无', copywriter: '暂无', none: true };
    }
    sheetList.playlists = playlists;
    sheetList.total = total;
    nameKey.value = name; // 保存name
    currentPage.value = 1; // 当卡页重置为1
    if (pop.value) {
        pop.value = !pop.value; // 关闭标签弹窗
    }
}

// 全部标签 跳转页面时，进行请求
const currentChange = async (page: number) => {
    const { playlists, total } = await getTopPlaylistDetail(nameKey.value, 64, (page - 1) * 64); // offset n-1*64
    sheetList.playlists = playlists;
    sheetList.total = total;
    scroll(5);
}

const boutique = () => {
    router.push({
        name: 'boutiquesongsheet', query: { name: nameKey.value }
    });
}

// tag变化 重新请求
watch(() => route.query.name, (name) => {
    if (!name) return;
    tagsList(name as string);
})

onMounted(async () => {
    try {
        await getAllTags(); // 全部标签
        await getTopTags(); // 精品标签
        await getTags();// tagsList和getTags不能并行 getTags必须先请求
        await tagsList(route.query.name as string || hotTags.value[0]); // 如果namekey为空，就拿第一项初始化
        loading.value = true;
    }
    catch (e) {
        console.log(e, "初始化歌单失败");
    }
})
</script>

<style lang="scss" scoped>
.song-sheet {
    // width: 100%;
    height: 100%;
    margin: 20px 0;

    .boutique {
        position: relative;
        height: 240px;
        margin-bottom: 25px;

        .page-img-back {
            position: absolute;
            width: 100%;
            height: 100%;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            border-radius: 10px;

            &::after {
                content: '';
                display: block;
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(44, 44, 44, 0.5);
                backdrop-filter: blur(20px);
                border-radius: 10px;
                overflow: hidden;
            }
        }

        .content-box {
            display: flex;
            align-items: center;
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            cursor: pointer;

            .page-img {
                width: 200px;
                height: 200px;
                padding: 20px;
            }

            .sheet-box {
                display: flex;
                flex-direction: column;
                height: inherit;

                .sheet-type {
                    display: inline-block;
                    padding: 5px 20px;
                    border-radius: 20px;
                    border: 1px solid #e0a464;
                    color: #e0a464;
                    align-self: flex-start;
                    margin-top: 55px;
                }

                .sheet-desc {
                    color: #ffffff;
                    font-weight: 700;
                    font-size: 20px;
                    margin-top: 30px;
                }

                .copy-writer {
                    padding-top: 15px;
                    padding-left: 5px;
                    color: #BCB7B7;
                }

            }
        }

        .page-img {
            width: 200px;
            height: 100px
        }
    }

    .sheet-module {
        padding: 10px 15px;
        border-radius: 15px;
        background-color: #ffffff;

        .sheet-tags-all {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 10px 12px 10px;
            box-sizing: border-box;
            color: #373737;

            .tags-position {
                width: 600px;
                height: 400px;
                position: absolute;
                left: 0;
                top: 40px;
                z-index: 99;
                background: #ffffff;
                box-shadow: 0 0 5px #4f4f4f;
                border-radius: 10px;
                overflow: auto;

                &::-webkit-scrollbar {
                    width: 0;
                }

                .tags-type {
                    margin-top: 10px;

                    .tags-hight-light {
                        font-weight: 700;
                        padding-left: 10px;
                    }
                }

                .tags-common-type {
                    .tags {
                        display: inline-block;
                        padding: 0 10px;
                        margin: 10px 5px;
                        cursor: pointer;

                        span {
                            display: inline-block;
                            margin-bottom: 6px;

                            sup {
                                color: #F84E4E;
                            }
                        }

                        &:hover {
                            color: #F84E4E;
                        }
                    }
                }
            }

            .choose-key {
                display: flex;
                align-items: center;
                border-radius: 20px;
                border: 1px solid rgb(170, 170, 170);
                padding: 0px 15px;
                user-select: none;
                color: #656464;
                cursor: pointer;
                font-size: 20px;

                &:hover {
                    background-color: #ffe1ed;
                    color: #f86262;
                    border-color: #f86262;
                }
            }

            .sheet-list-tag {
                display: flex;
                align-items: center;
                margin: 0;

                .sheet-hot-tag {
                    display: inline-block;
                    padding: 5px 12px;
                    margin: 0 5px;
                    cursor: pointer;
                }
            }
        }
    }
}

.hight-light {
    border-radius: 3px;
    background-color: rgb(245, 204, 211);
    color: #F84E4E;
}

.pagination {
    width: 100%;
    @include _flex(center, center);
    margin-top: 15px;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
    background-color: pink !important; //修改默认的背景色
    cursor: pointer;
}

:deep(.el-pagination) {
    --el-pagination-hover-color: pink !important;
}
</style>