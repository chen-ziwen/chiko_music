<template>
    <ul class="boutique-sheet" ref="scrollTop">
        <li class="boutique-sheet-list" :class="'item-' + props.item" v-for="(item, index) in props.sheet" :key="item.id + index" @click="sheetid(item.id)">
            <div class="sheet-img-box">
                <el-image class="sheet-img" :src="item.picUrl || item.coverImgUrl + '?param=250y250'" fit="fill">
                    <template #placeholder>
                        <div class="image-slot">
                            <el-icon>
                                <icon-picture />
                            </el-icon>
                        </div>
                    </template>
                </el-image>
                <div class="top"><i class="iconfont icon-huangguan1 huang"></i></div>
                <div class="play-count">
                    <i class="iconfont icon-bofang1"></i>
                    <span class="count-num">{{ changeNum(item.playCount) }}</span>
                </div>
            </div>
            <div class="sheet-list">
                <span class="sheet-text">{{ item.name }}</span>
                <span class="creator-name">
                    by {{ item.creator.nickname }}
                    <img class="vip-level" :src="item.creator?.avatarDetail?.identityIconUrl">
                </span>
                <span class="copy-writer">{{ item.copywriter }}</span>
            </div>
        </li>
    </ul>
</template>
<script lang='ts' setup>
import { computed, ref, nextTick } from 'vue';
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

const router = useRouter();

const scrollTop = ref<HTMLElement>();
// 返回id
const sheetid = (id: number) => {
    router.push({ name: 'sheetlist', query: { id } })
}

const topWay = () => {
    nextTick(() => {
        if (!scrollTop.value) return;
        scrollTop.value.scrollTop = 0;
    })
}
defineExpose({ topWay }) // 向父组件暴露方法

</script>

<style lang='scss' scoped>

    ::-webkit-scrollbar {
       width: 6px;
    }
    ::-webkit-scrollbar-track {
        display: none;
    }
    ::-webkit-scrollbar-thumb {
        background-color: rgb(8,15,49,.5);
        border-radius: 10px;

    }
.boutique-sheet {
    &:deep(.el-image) {
        
        img {
            border-radius:5px;
        }
    }
   
    .boutique-sheet-list {
    position: relative;
    display: inline-flex;
    margin: 10px 15px 50px 15px;
    vertical-align: top;
    cursor: pointer;
     .sheet-img-box {
        flex-shrink: 0;
        position: relative;
        border-radius: 5px;
        box-shadow: 4px 4px 6px grey;
        z-index: 9;
        overflow: hidden;
        
        .sheet-img{
           width: 150px;
           height: 100%;
        }
        .top {
            position: absolute;
            left: 0px;
            top: 0px;
            content: '';
            display: block;
            // 三角形
            border-top: 20px solid transparent;
            border-bottom: 20px solid transparent;
            border-left: 20px solid transparent;
            border-right: 20px solid #F3B068;
            z-index: 9;
            transform: translate(-20px,-20px) rotateZ(45deg);
            .huang {
                position: absolute;
                font-size: 12px;
                transform: translate(5px,-6px) rotateZ(-90deg);
                color: #ffffff;
            }
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
     
     .describe-text {
        padding-top: 5px;
        display: inline-block;
        font: normal 700 16px Arial, Helvetica, sans-serif;
        width: 100%;
        text-align: v-bind(textdir);
     }
     .sheet-list {
        display: flex;
        flex-direction: column;
        >span {
            margin-left: 20px
        }
        .sheet-text {
            margin-top: 20px;
            color: rgb(44,44,44);
        }
        .creator-name {
            margin-top: 10px;
            font-size: 14px;
            color:#6f6e6e;
            .vip-level {
                width:15px;
                height: 15px;
            }
        }
        .copy-writer {
            margin-top: 8px;
            font-size: 13px;
            color: rgb(165, 165, 165);
        }
     }
     
  }
}

.image-slot {
    @include _imgslot(150px, 150px, 30px);
}

// 项目平均分 2 - 10 格
@for $i from 2 through 10 {
    .item-#{$i} {
        width: calc(100%/$i - 30px); // 间距30px
    }
}

</style>