<template>
    <div class="song-sheet">
        <!-- 精品歌单 -->
        <div class="boutique">
            精品歌单位置
        </div>
        <div class="sheet-tags-all">
            <div class="choose-key">{{nameKey}}</div>
            <ul class="sheet-list-tag">
                <li class="sheet-hot-tag" v-for="item in hotTags" :class="hightlight(item.name)" @click="tagsList(item.name)">
                    {{item.name}}
                </li>
            </ul>
        </div>
        <SongSheet :sheet="sheetList.playlists"></SongSheet>
        <el-pagination class="my-pagination" v-model:currentPage="curretnPage" :page-size="64" layout="prev, pager, next" :total="sheetList.total" @current-change="currentChange" />
    </div>
</template>

<script lang="ts" setup>
import { getPlaylistHot, getTopPlaylistDetail } from '@/api/http/api';
import SongSheet from '@/components/common/SongSheet.vue';
import { onMounted, reactive, ref, computed } from 'vue';

interface SongSheet {
    sheetList: Array<any>
}
interface TagsType {
    id: number;
    name: string;
    type: number;
    category: number;
    hot: boolean;
}
const props = defineProps<SongSheet>();
const hotTags = ref<TagsType[]>([]);
const sheetList = reactive({
    playlists: [],
    total: 0
})
const curretnPage = ref<number>(1);
const nameKey = ref<string>('华语');

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

// 
const tagsList = async (name: string) => {
    const { playlists, total } = await getTopPlaylistDetail(name, 64, 0);
    sheetList.playlists = playlists;
    sheetList.total = total;
    curretnPage.value = 1; // 当卡页重置为1
    nameKey.value = name; // 保存name
}

const currentChange = async (page: number) => {
    const { playlists, total } = await getTopPlaylistDetail(nameKey.value, 64, (page - 1) * 64); // offset n-1*64
    sheetList.playlists = playlists;
    sheetList.total = total;
    document.documentElement.scrollTop = 0;
}

// onMounted(() => {
getTags()
tagsList('华语')
// })
</script>

<style lang="scss" scoped>
    .song-sheet {
        .boutique {
        height: 140px;
        background-color: aquamarine;
     
    }
    .sheet-tags-all {
        display: flex;
        justify-content: space-between;

        .choose-key {
            font-size: 24px;
            border-radius:30px;
            margin-top: 10px;
            border:1px solid black;
        }
        
    .sheet-list-tag {
        margin-bottom: 20px;
        margin-top: 10px;
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
        background-color: #ffffff;
        color: red;
    }
</style>