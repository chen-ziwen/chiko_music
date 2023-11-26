<template>
    <el-skeleton :loading="loading" animated :count="4">
        <template #template>
            <div class="ske-item">
                <el-skeleton-item class="el-skl-img" variant="image" />
                <div class="el-skl-txt">
                    <el-skeleton-item class="el-skl-txt-item" v-for="i in 5" :key="i" />
                </div>
            </div>
        </template>
        <template #default>
            <ul class="ranks">
                <li class="rank-list" v-for="(item, index) in rankSheet" :key="item.id">
                    <el-image class="sheet-pic" :src="item.picUrl || item.coverImgUrl + '?param=400y400'" fit="fill"
                        @click="turnPage(item.id)">
                        <template #placeholder>
                            <div class="image-slot">
                                <el-icon>
                                    <icon-picture />
                                </el-icon>
                            </div>
                        </template>
                    </el-image>
                    <div class="play-count">
                        <i class="iconfont icon-bofang1"></i>
                        <span class="count-num">{{ changeNum(item.playCount) }}</span>
                    </div>
                    <ul class="songs">
                        <li class="song-list" v-for="(data, order) in item.songList" @click="choseSong(index, order)">
                            <div class="song-msg">
                                <span class="song-index">{{ data.idx }}</span>
                                <span class="song-name" :class="checked(index, data.idx, data.id)">{{ data.name }}</span>
                            </div>
                            <span class="singer-name">{{ data.singer }}</span>
                        </li>
                    </ul>
                </li>
            </ul>
        </template>
    </el-skeleton>
</template>

<script lang="ts" setup>
import { Picture as IconPicture } from '@element-plus/icons-vue';
import type { RecommendList } from '@/models/detail';
import { useRouter } from 'vue-router';
import { usePlay } from '@/store/play';
import { changeNum } from '@/util';

interface RanShow {
    rankSheet: RecommendList[]
    loading: boolean;
}

withDefaults(defineProps<RanShow>(), {
    loading: true,
});
const emits = defineEmits(['sheetid']);
const play = usePlay();
const router = useRouter();
let checkedIdx = 0; // 选中排行哪一模块

const checked = (index: number, idx: number, id: number) => {
    if (index == checkedIdx && idx - 1 === play.currentindex && id === play.currentPlay.id && idx <= 5) {
        return 'checked';
    }
    return "";
}

const choseSong = (index: number, order: number) => {
    checkedIdx = index;
    emits("sheetid", index, order)
}
const turnPage = (id: number) => router.push({ name: 'sheetlist', query: { sheetid: id } });
</script>

<style lang="scss" scoped>
.ranks {
    .rank-list {
        position: relative;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        margin: 15px 15px 40px 15px;

        .play-count {
            z-index: 10;
            position: absolute;
            left: 4px;
            top: 6px;
            padding: 4px;
            font-size: 16px;
            border-radius: 4px;
            background-color: rgba(0, 0, 0, 0.5);
            color: rgba(255, 255, 255);

            .count-num {
                padding-left: 3px;
            }
        }

        .sheet-pic {
            flex-shrink: 0;
            width: 180px;
            height: 180px;
            margin-right: 40px;
            cursor: pointer;
        }

        .songs {
            width: 100%;

            .song-list {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 8px 0;
                cursor: pointer;

                &:hover {
                    background-color: #c6c6c6 !important;
                }

                &:nth-of-type(-n+3) .song-index {
                    color: rgb(250, 25, 25) !important;
                }

                &:nth-of-type(odd) {
                    background-color: #FAFAFA;
                }

                .song-msg {
                    .song-index {
                        padding: 0 12px;
                        color: #48c941;
                    }
                }

                .singer-name {
                    padding-right: 20px;
                    color: #999999;
                    font-size: 14px;
                }
            }
        }
    }
}

.checked {
    color: rgb(255, 145, 0) !important;
    font-weight: 600;
}

.el-skeleton {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .ske-item {
        display: flex;
        margin: 15px 15px 40px 15px;

        .el-skl-img {
            flex-shrink: 0;
            width: 180px;
            height: 180px;
            margin-right: 40px;
        }

        .el-skl-txt {
            width: 100%;

            .el-skl-txt-item {
                padding: 10px 0;
            }
        }
    }
}
</style>