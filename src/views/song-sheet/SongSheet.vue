<template>
    <div class="song-sheet" @click="pop = false">
        <div class="boutique" @click="boutique" v-if="!page?.none">
            <div class="page-img-back" :style="{ backgroundImage: `url(${page.coverImgUrl})` }"></div>
            <div class="content-box" v-if="page.coverImgUrl">
                <img class="page-img" :src="page.coverImgUrl" />
                <div class="sheet-box">
                    <span class="sheet-type">
                        <i class="iconfont icon-huangguan"></i>
                        精品歌单</span>
                    <span class="sheet-desc">【 {{ page.name }} 】</span>
                    <span class="copy-writer">{{ page.copywriter }}</span>
                </div>
            </div>
        </div>
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
                <div class="tags-position" v-if="pop">
                    <div class="tags-type" v-for="(item, index) in allTags" :key="item.name + index">
                        <span class="tags-hight-light">{{ item.name }}</span>
                        <ul class="tags-common-type">
                            <li class="tags" v-for="data in item.list" :key="data.name" :class="hightlight(data.name)" @click="tagsList(data.name)">
                                <span>{{ data.name }}<sup>{{ data.hot ? "hot" : "" }}</sup></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </Transition>
        </div>
        <SongSheetCard :sheet="sheetList.playlists" :item="7"></SongSheetCard>
        <el-pagination class="my-pagination" v-model:currentPage="curretnPage" :page-size="63" layout="prev, pager, next" :total="sheetList.total" @current-change="currentChange" />
    </div>
</template>

<script lang="ts" setup>
import { getPlaylistHot, getTopPlaylistDetail, getPlaylistCatlist, getHighquality, getHighQualityTags } from '@/api/http/api';
import SongSheetCard from '@/components/song-sheet/SongSheetCard.vue';
import { ArrowDown } from '@element-plus/icons-vue';
import { onMounted, reactive, ref, computed, watch, toRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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
    }[]
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
const route = useRoute();
const router = useRouter();

const sheetList = reactive({
    playlists: [],
    total: 0
})
const hightSheet = reactive({
    page: {} as HightPage,
    hightlists: [],
    total: 0,
});

const curretnPage = ref<number>(1);
const nameKey = ref<string>('');
const pop = ref<boolean>(false);
const page = toRef(hightSheet, "page");

const hightlight = (name: string) => {
    if (name == nameKey.value) {
        return 'hight-light';
    }
    return;
}

async function getTags() {
    // 获取热门歌单标签
    const { tags } = await getPlaylistHot();
    hotTags.value = tags.map((x: HotTags) => x.name);
}
// 获取精品标签
async function getTopTags() {
    const { tags } = await getHighQualityTags();
    TopTags.value = tags.map((x: HotTags) => x.name); // 拿到精品标签数组
}

// 获取全部标签
async function getAllTags() {
    const { sub, categories } = await getPlaylistCatlist();
    // 分成一个大数组，大数组中包含类别对象，对象中包括分类名和类型数组集合
    let tagList: AllTags[] = [];
    // 对标签进行分类
    for (let i = 0; i < sub.length; i++) {
        let tags = { name: sub[i].name, hot: sub[i].hot, category: sub[i].category, type: sub[i].type };
        if (tagList[sub[i].category] === undefined) {
            tagList[sub[i].category] = { name: categories[sub[i].category], list: [tags] }
        } else {
            tagList[sub[i].category].list.push(tags)
        }
    }
    allTags.value = tagList;
}

// 全部标签选中
const tagsList = async (name: string) => {
    const { playlists, total } = await getTopPlaylistDetail(name, 63, 0);
    if (TopTags.value.includes(name)) {
        const res = await getHighquality(name, 1);
        page.value = res.playlists[0]; // 拿到歌单分类里的第一个歌单
    } else {
        page.value = { coverImgUrl: 'none', name: '暂无', copywriter: '暂无', none: true };
    }
    nameKey.value = name; // 保存name
    sheetList.playlists = playlists;
    sheetList.total = total;
    curretnPage.value = 1; // 当卡页重置为1
    if (pop.value) {
        pop.value = !pop.value; // 关闭标签弹窗
    }
}

//全部标签 跳转页面时，进行请求
const currentChange = async (page: number) => {
    const { playlists, total } = await getTopPlaylistDetail(nameKey.value, 63, (page - 1) * 63); // offset n-1*63
    sheetList.playlists = playlists;
    sheetList.total = total;
    document.documentElement.scrollTop = 0;
}
const boutique = () => {
    router.push({
        name: 'boutiquesongsheet', query: { name: nameKey.value }
    })
}

// 当name 发生变化时，重新获取所有的数据
watch(() => route.query.name, (name) => {
    if (!name) return; // 必须加 避免切换时name为undefined
    tagsList(name as string);
})

// 按 await顺序初始化标签
onMounted(async () => {
    try {
        await getAllTags(); // 全部标签
        await getTopTags(); // 精品标签
        await getTags();// 等getTags之行完 在去执行tagsList
        await tagsList(route.query.name as string || hotTags.value[0]); // 如果namekey为空，就拿第一项初始化
    }
    catch (e) {
        console.log(e, "初始化歌单失败");
    }
})
</script>

<style lang="scss" scoped>
.song-sheet {
    .boutique {
        margin-top: 20px;
        height: 240px;
        background-color: $color;
        position: relative;
        
        .page-img-back {
            position: absolute;
            width: 100%;
            height: 100%;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            border-radius:15px;
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
                border-radius:15px;
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
                width:200px;
                height: 200px;
                padding: 20px;
            }
            .sheet-box {
                display: flex;
                flex-direction: column;
                height: inherit;
                .sheet-type {
                    display: inline-block;
                    padding:5px 20px;
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
    .sheet-tags-all {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        margin-top: 35px;
        color: #373737;
        .tags-position {
            position: absolute;
            left: 0;
            top: 40px;
            width: 600px;
            height: 400px;
            z-index: 99;
            background-color: #F9FAFC;
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
            font-size: 20px;
            border-radius: 20px;
            border: 1px solid rgb(170, 170, 170);
            padding: 0px 20px;
            user-select: none;
            color: #656464;
            cursor: pointer;

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
    .my-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 35px 0;

    }
    &:deep(.el-pagination) {
        --el-pagination-hover-color: rgb(248, 60, 60);
        --el-pagination-bg-color: transparent;
        --el-pagination-text-color: #302424c2;
        --el-pagination-font-size: 18px;
        font-weight: 700;

        button:disabled {
            background-color: transparent;
        }
    }
}
.hight-light {
    border-radius: 16px;
    background-color: #f9d8e5;
    color: #F84E4E;
}

</style>