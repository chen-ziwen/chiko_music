<template>
    <ul>
        <li v-for="(item, index) in props.sheet" :key="item.id + index" @click="sheetid(item.id)">
            <el-image class="sheet-pic" :src="item.picUrl||item.coverImgUrl + '?param=125y125'" fit="fill">
                <template #placeholder>
                    <div class="image-slot">
                        <el-icon>
                            <icon-picture />
                        </el-icon>
                    </div>
                </template>
            </el-image>
            <span>{{ item.name }}</span>
        </li>
    </ul>
</template>
<script lang='ts' setup>
import { Picture as IconPicture } from '@element-plus/icons-vue';
import type { RecommendList } from "@/models/detail";
import { useRouter } from "vue-router";

interface SongSheet {
    sheet: RecommendList[];
    textdir?: string;
}
const props = withDefaults(defineProps<SongSheet>(), {
    textdir: 'start',
});
const router = useRouter();
// 返回id
const sheetid = (id: number) => {
    router.push({ name: 'sheetlist', query: { id } })
}
</script>

<style lang='scss' scoped>
ul {
    li {
    display: inline-block;
    width: calc(12.5% - 30px); // 分8块
    margin: 10px 15px 10px 15px;
    vertical-align: top;
    cursor: pointer;

    span {
        display: inline-block;
        font: {
            size: 16px;
            weight: 700;
            family: Arial, Helvetica, sans-serif;
        }
        width: 100%;
        text-align: v-bind(textdir);
     }
     .sheet-pic {
        min-width: 125px;
        min-height: 125px;
        width: 100%;
        height: 100%;
        border-radius: 5px
     }
  }
}

.image-slot {
    @include _imgslot(125px, 125px, 30px);
}

</style>