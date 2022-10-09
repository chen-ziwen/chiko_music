<template>
    <div class="song-sheet">
        <!-- 精品歌单 -->
        <div class="boutique">
            精品歌单位置
        </div>
        <div class="sheet-list-tag">
            <ul>
                <li class="sheet-hot-tag" v-for="item in hotTags" @click="tagsList(item.id)">
                    {{item.name}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getPlaylistHot, getPlaylistCatlist } from '@/api/http/api';
import { onMounted, reactive, ref } from 'vue';

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

async function getTags() {
    const { tags } = await getPlaylistHot();
    hotTags.value = tags;
    console.log('tags', hotTags.value);

}
const tagsList = (id: number) => {
    console.log('id', id);

}
onMounted(() => {
    getTags()
})
</script>

<style lang="scss" scoped>
    .song-sheet {
        .boutique {
        height: 140px;
        background-color: aquamarine;
    }
    .sheet-list-tag {
      .sheet-hot-tag {
        display:inline-block;
        padding: 5px 10px;
        cursor: pointer;
      }  
    }
    }
    
</style>