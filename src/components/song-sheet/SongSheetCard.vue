<template>
    <ul class="song-sheet-card">
        <li class="song-sheet-card-list" :class="'item-' + props.item" v-for="(item, index) in props.sheet"
            :key="item.id + index" @click="sheetid(item.id)">
            <div class="sheet-pic-box">
                <el-image class="sheet-pic" :src="item.picUrl || item.coverImgUrl + '?param=200y200'" fit="fill">
                    <template #placeholder>
                        <div class="image-slot">
                            <el-icon>
                                <icon-picture />
                            </el-icon>
                        </div>
                    </template>
                </el-image>
                <span class="bofang-btn">
                    <i class="bofang iconfont icon-bofang1"></i>
                </span>
            </div>
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
import { changeNum } from '@/util';

interface SongSheetCard {
    sheet: RecommendList[];
    textdir?: string;
    item?: number;
    backShow?: boolean;
    back?: string;
}
const props = withDefaults(defineProps<SongSheetCard>(), {
    textdir: 'start',
    item: 8,
    backShow: true,
    back: "transparent"
});

const emits = defineEmits(['sheetid'])
const router = useRouter();
// 返回id
const sheetid = (id: number) => {
    emits("sheetid", id)
    router.push({ name: 'sheetlist', query: { sheetid: id } })
}
const showBakc = computed(() => props.backShow ? "block" : "none");

</script>

<style lang='scss' scoped>
.song-sheet-card {

    &:deep(.el-image) {
        img {
            border-radius: 5px;
        }
    }

    .song-sheet-card-list {
        position: relative;
        display: inline-block;
        margin: var(--main-margin);
        vertical-align: top;
        cursor: pointer;

        .sheet-pic-box {
            position: relative;

            &:hover .bofang-btn {
                display: flex;
            }

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
                    top: 0;
                    border-radius: 5px;
                    transform: rotate(12deg);
                    background-color: rgba(128, 128, 128, 0.45);
                    z-index: -1;
                }
            }

            .bofang-btn {
                position: absolute;
                right: 8px;
                bottom: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                width: 28px;
                height: 28px;
                background-color: rgba(239, 237, 237, 0.909);
                z-index: 10;
                display: none;

                .bofang {
                    color: rgb(249, 43, 43);
                    font-size: 16px;
                    transform: translateX(1px);
                }
            }
        }

        .describe-text {
            padding-top: 5px;
            display: inline-block;
            font: normal 700 14px Arial, Helvetica, sans-serif;
            color: #2b2b2b;
            width: 100%;
            text-align: v-bind(textdir);
        }

        .play-count {
            z-index: 10;
            position: absolute;
            right: 4px;
            top: 4px;
            padding: 3px;
            font-size: 13px;
            border-radius: 4px;
            background-color: rgba(0, 0, 0, 0.5);
            color: rgba(255, 255, 255);

            .count-num {
                padding-left: 3px;
            }
        }
    }
}

.image-slot {
    @include _imgslot(121.25px, 121.25px, 30px);
}

// 项目平均分 2 - 10 格
@for $i from 2 through 10 {
    .item-#{$i} {
        width: calc(100%/$i - 30px); // 间距30px
    }
}
</style>