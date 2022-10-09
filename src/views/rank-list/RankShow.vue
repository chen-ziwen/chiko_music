<template>
    <ul class="ranks">
        <li class="rank-list" v-for="(item, index) in rankSheet" :key="item.id + index">
            <el-image class="sheet-pic" :src="item.picUrl||item.coverImgUrl + '?param=200y200'" fit="fill" @click="sheetid(item.id)">
                <template #placeholder>
                    <div class="image-slot">
                        <el-icon>
                            <icon-picture />
                        </el-icon>
                    </div>
                </template>
            </el-image>
            <ul class="songs">
                <li class="song-list" v-for="data in item.songList" @click="choseSong(item.id,data.index-1)">
                    <div class="song-msg">
                        <span class="song-index">{{data.index}}</span>
                        <span class="song-name" :class="checked(data.index,data.id)">{{data.name}}</span>
                    </div>
                    <span class="singer-name">{{changeData(data.singer)}}</span>
                </li>
            </ul>
        </li>
    </ul>
</template>

<script lang="ts" setup>
import { Picture as IconPicture } from '@element-plus/icons-vue';
import type { RecommendList } from '@/models/detail';
import { useRouter } from 'vue-router';
import { usePlay } from '@/store/play';
import { changeData } from '@/hook';

interface RanShow {
    rankSheet: RecommendList[]
}

const props = defineProps<RanShow>();
const emits = defineEmits(['sheetid']);
const play = usePlay();
const router = useRouter();

const checked = (index: number, id: number) => {
    if (index - 1 === play.currentindex && id === play.currentPlay.id && index <= 5) {
        return 'checked'
    }
    return;
}

const choseSong = (id: number, index: number) => {
    emits("sheetid", id, index)
}
const sheetid = (id: number) => {
    router.push({ name: 'sheetlist', query: { id } })
}
</script>

<style lang="scss" scoped>
.ranks {
    .rank-list {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        margin: 15px 15px 40px 15px;

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
</style>