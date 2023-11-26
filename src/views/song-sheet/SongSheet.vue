<template>
    <div class="song-sheet">
        <el-skeleton :loading="loading" animated v-if="!page?.none">
            <template #template>
                <div class="ske-item">
                    <el-skeleton-item class="el-skl-img" variant="image" />
                    <div class="el-skl-txt">
                        <el-skeleton-item v-for="i in 2" :class="'el-skl-txt-item el-skl-txt-item-' + i" :key="i"
                            variant="text" />
                    </div>
                </div>
            </template>
            <template #default>
                <div class="boutique" @click="boutique">
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
            </template>
        </el-skeleton>
        <div class="sheet-module">
            <template v-if="sheetList.playlists.length">
                <div class="sheet-tags-all">
                    <div class="choose-key" @click.stop="pop = !pop">{{ nameKey }}
                        <el-icon>
                            <ArrowDown />
                        </el-icon>
                    </div>
                    <ul class="sheet-list-tag">
                        <li class="sheet-hot-tag" v-for="name of hotTags" :class="hightlight(name)" @click="tagsList(name)">
                            {{ name }}
                        </li>
                    </ul>
                </div>
                <SongSheetCard :sheet="sheetList.playlists" :item="8" :back-show="false" />
                <div v-if="sheetList.playlists.length">
                    <el-pagination class="pagination" layout="prev, pager, next" background :total="sheetList.total || 0"
                        :page-size="64" @current-change="currentChange" v-model:currentPage="currentPage"
                        :hide-on-single-page="true" />
                </div>
            </template>
            <Loading v-else :min-height="200" />
            <Transition name="pop">
                <div class="tags-position" v-if="pop" v-close-outside="() => pop = false">
                    <div class="tags-type" v-for="(item, index) in allTags" :key="item.name + index">
                        <span class="tags-hight-light">{{ item.name }}</span>
                        <ul class="tags-common-type">
                            <li class="tags" v-for="data in item.list" :key="data.name" :class="hightlight(data.name)"
                                @click="tagsList(data.name)">
                                <span>{{ data.name }}<sup :style="{ fontSize: '10px' }">{{ data.hot ? "hot" : ""
                                }}</sup></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getPlaylistHot, getTopPlaylistDetail, getPlaylistCatlist, getHighquality, getHighQualityTags } from '@/api/http/api';
import SongSheetCard from '@/components/song-sheet/SongSheetCard.vue';
import Loading from '@/components/common/loading/Loading.vue';
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
const loading = ref(true);
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

// 标签选中
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

const boutique = () => router.push({ name: 'boutiquesongsheet', query: { name: nameKey.value } });

// tag变化 重新请求
watch(() => route.query.name, (name) => {
    if (!name) return;
    tagsList(name as string);
})

onMounted(async () => {
    try {
        await getAllTags(); // 全部标签
        await getTopTags(); // 精品标签
        await getTags();
        await tagsList(route.query.name as string || hotTags.value[0]);
        loading.value = false;
    } catch (e) {
        console.log(e, "初始化歌单失败");
    }
})
</script>

<style lang="scss" scoped>
.song-sheet {
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
        position: relative;
        padding: 10px 15px;
        border-radius: 15px;
        background-color: #ffffff;

        .sheet-tags-all {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 10px 12px 10px;
            box-sizing: border-box;
            color: #373737;

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

        .tags-position {
            width: 600px;
            height: 400px;
            position: absolute;
            left: 20px;
            top: 60px;
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

        .sheet-content {
            height: 100%;
        }
    }
}

.hight-light {
    border-radius: 3px;
    background-color: rgb(245, 204, 211);
    color: #F84E4E;
}

.el-skeleton {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .ske-item {
        display: flex;
        height: 240px;
        margin-bottom: 25px;
        background-color: #FFFFFF;

        .el-skl-img {
            flex-shrink: 0;
            width: 200px;
            height: 200px;
            margin: 20px;
        }

        .el-skl-txt {
            width: 100%;
            display: flex;
            flex-direction: column;

            &-item {
                height: 30px;
                margin: 20px 10px;

                &-1 {
                    margin-top: 60px;
                    width: 20%;
                }

                &-2 {
                    width: 40%;
                }
            }
        }
    }
}
</style>