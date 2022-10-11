<template>
    <div class="song-sheet">
        <!-- 精品歌单 -->
        <div class="boutique">
            精品歌单位置
        </div>
        <div class="sheet-tags-all">
            <div class="choose-key" @click="pop=!pop">
                {{nameKey}}
                <el-icon>
                    <ArrowDown />
                </el-icon>
            </div>
            <ul class="sheet-list-tag">
                <li class="sheet-hot-tag" v-for="item in hotTags" :class="hightlight(item.name)" @click="tagsList(item.name)">
                    {{item.name}}
                </li>
            </ul>
            <Transition name="pop">
                <div class="tags-position" v-if="pop">
                    <div class="tags-type" v-for="(item,index) in allTags" :key="item.name+index">
                        <span class="tags-hight-light">{{item.name}}</span>
                        <ul class="tags-common-type">
                            <li class="tags" v-for="data in item.list" :key="data.name" :class="hightlight(data.name)" @click="tagsList(data.name)">
                                <span>{{data.name}}<sup>{{data.hot?"hot":""}}</sup></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </Transition>
        </div>
        <SongSheet :sheet="sheetList.playlists"></SongSheet>
        <el-pagination class="my-pagination" v-model:currentPage="curretnPage" :page-size="64" layout="prev, pager, next" :total="sheetList.total" @current-change="currentChange" />
    </div>
</template>

<script lang="ts" setup>
import { getPlaylistHot, getTopPlaylistDetail, getPlaylistCatlist, getHighquality, getHighQualityTags } from '@/api/http/api';
import SongSheet from '@/components/common/SongSheet.vue';
import { ArrowDown } from '@element-plus/icons-vue';
import { onMounted, reactive, ref, computed } from 'vue';

interface SongSheet {
    sheetList: Array<any>
}
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
const props = defineProps<SongSheet>();
const hotTags = ref<HotTags[]>([]); // 热门标签
const allTags = ref<AllTags[]>([]); // 全部标签
const TopTags = ref<HotTags[]>([]); //精品标签

const sheetList = reactive({
    playlists: [],
    total: 0
})
const curretnPage = ref<number>(1);
const nameKey = ref<string>('');
const pop = ref<boolean>(false);

const hightlight = (name: string) => {
    if (name == nameKey.value) {
        return 'hight-light';
    }
    return;
}

// 获取热门歌单标签
async function getTags() {
    const { tags } = await getPlaylistHot();
    hotTags.value = tags;
}
// 获取精品标签
async function getTopTags() {
    const { tags } = await getHighQualityTags();
    TopTags.value = tags;
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


const tagsList = async (name: string) => {
    const { playlists, total } = await getTopPlaylistDetail(name, 64, 0);
    sheetList.playlists = playlists;
    sheetList.total = total;
    curretnPage.value = 1; // 当卡页重置为1
    nameKey.value = name; // 保存name
    if (pop.value) {
        pop.value = !pop.value; // 关闭标签弹窗
    }
}

// 跳转页面时，进行请求
const currentChange = async (page: number) => {
    const { playlists, total } = await getTopPlaylistDetail(nameKey.value, 64, (page - 1) * 64); // offset n-1*64
    sheetList.playlists = playlists;
    sheetList.total = total;
    document.documentElement.scrollTop = 0;
}

// 按 await顺序初始化标签
onMounted(async () => {
    await getTags();// 等getTags之行完 在去执行tagsList
    await getAllTags();
    await tagsList(hotTags.value[0].name) // 传入热门标签的第一项 作为初始化
})
</script>

<style lang="scss" scoped>
    .song-sheet {
        .boutique {
        height: 140px;
        background-color: aquamarine;
     
    }
    .sheet-tags-all {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        margin-top: 10px;
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
            &::-webkit-scrollbar{
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
                .tags{
                    display: inline-block;
                    padding: 0 10px;
                    margin: 10px 5px;
                    cursor: pointer;
                    span {
                        display: inline-block;
                        margin-bottom: 6px;
                        sup{
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
            border-radius:20px;
            border:1px solid rgb(170, 170, 170);
            padding: 0px 20px;
            user-select: none;
            cursor: pointer;
            &:hover {
                background-color: #ffffff;
            }
        }
        
    .sheet-list-tag {
        display: flex;
        align-items: center;
        margin: 0;

      .sheet-hot-tag {
        display:inline-block;
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
        margin:35px 0;
        
    }
    &:deep(.el-pagination) {
            --el-pagination-hover-color:rgb(248, 60, 60) ;
            --el-pagination-bg-color:transparent;
            --el-pagination-text-color:#302424c2;
            button:disabled {
                background-color: transparent;
            }
        }
    }
    .hight-light {
        border-radius: 16px;
        background-color: #ffffd0;
        color: #F84E4E;
    }
.pop-enter-active,
.pop-leave-active {
  transition: all 0.25s ease-in-out;
}

.pop-enter-from,
.pop-leave-to {
  transform: translateY(120px);
  opacity: 0;
}
</style>