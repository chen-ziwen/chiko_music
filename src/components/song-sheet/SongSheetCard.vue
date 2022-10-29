<template>
    <ul>
        <li :class="'item-' + props.item" v-for="(item, index) in props.sheet" :key="item.id + index" @click="sheetid(item.id)">
            <el-image class="sheet-pic" :src="item.picUrl || item.coverImgUrl + '?param=125y125'" fit="fill">
                <template #placeholder>
                    <div class="image-slot">
                        <el-icon>
                            <icon-picture />
                        </el-icon>
                    </div>
                </template>
            </el-image>
            <span class="describe-text">{{ item.name }}</span>
            <div class="play-count">
                <i class="iconfont icon-bofang1"></i>
                <span class="count-num">{{ changeNum(item.playCount) }}</span>
            </div>
        </li>
    </ul>
</template>
<script lang='ts' setup>
import { computed } from 'vue';
import { Picture as IconPicture } from '@element-plus/icons-vue';
import type { RecommendList } from "@/models/detail";
import { useRouter } from "vue-router";
import { changeNum } from '@/hook';

interface SongSheetCard {
    sheet: RecommendList[];
    textdir?: string;
    item?: number;
    backShow?: boolean;
}
const props = withDefaults(defineProps<SongSheetCard>(), {
    textdir: 'start',
    item: 8,
    backShow: true,
});

const emits = defineEmits(['sheetid'])
const router = useRouter();
// 返回id
const sheetid = (id: number) => {
    emits("sheetid", id)
    router.push({ name: 'sheetlist', query: { id } })
}
const showBakc = computed(() => props.backShow ? "block" : "none");

</script>

<style lang='scss' scoped>

   
ul {
    &:deep(.el-image) {
        
        img {
            border-radius:5px;
        }
    }
    li {
    position: relative;
    display: inline-block;
    // width: calc(12.5% - 30px); // 分8块
    margin: 10px 15px 10px 15px;
    vertical-align: top;
    cursor: pointer;
     .sheet-pic {
        width: 100%;
        height: 100%;
        border-radius: 5px;
        box-shadow: 4px 4px 6px grey;
        z-index: 9;
        overflow: visible;
        
        &::after {
            content: '';
            display: v-bind(showBakc);
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top:0;
            border-radius: 5px;
            transform: rotate(12deg);
            background-color: rgba(128, 128, 128, 0.45);
            z-index: -1;
        }
     }
     .describe-text {
        padding-top: 5px;
        display: inline-block;
        font: normal 700 16px Arial, Helvetica, sans-serif;
        width: 100%;
        text-align: v-bind(textdir);
     }
     .play-count {
       z-index: 10;
       position: absolute;
       right: 4px;
       top: 4px;
       padding: 4px;
       font-size: 13px;
       border-radius: 4px;
       background-color: rgba(0, 0, 0, 0.5);
       color: rgba(255,255,255);
       .count-num {
        padding-left: 3px;
       }
     }
  }
}

.image-slot {
    @include _imgslot(145px, 145px, 30px);
}

// 项目平均分 2 - 10 格
@for $i from 2 through 10 {
    .item-#{$i} {
        width: calc(100%/$i - 30px); // 间距30px
    }
}

</style>