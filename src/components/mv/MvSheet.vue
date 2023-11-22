<template>
    <ul class="mv-sheet">
        <li class="mv-sheet-li" v-for="(data, index) in mvSheet" :key="index">
            <div class="newsong" @click="turnMvDetail(data.id)">
                <div class="img-box">
                    <el-image class="mv-img" style="min-width: 120px; min-height: 120px;"
                        :src="data?.picUrl + '?param=120y120'" fit="fill">
                        <template #placeholder>
                            <div class="image-slot">
                                <el-icon>
                                    <icon-picture />
                                </el-icon>
                            </div>
                        </template>
                    </el-image>
                    <span class="play flex-center" title="播放">
                        <i class="iconfont icon-bofang1"></i>
                    </span>
                </div>
                <div class="newsong-text">
                    <span>{{ data.name }}</span>
                    <span>{{ changeData(data.artists) }}</span>
                </div>
                <div class="newsong-text-time">
                    <span>{{ changetime(data.duration) }}</span>
                </div>
            </div>
        </li>
    </ul>
</template>
<script lang='ts' setup>
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { changetime, changeData } from '@/util';
import { useRouter } from 'vue-router';

interface MvSheet {
    mvSheet: any[];
}
const props = defineProps<MvSheet>();
const router = useRouter();

const turnMvDetail = (id: number) => {
    router.push({ name: 'mvdetail', query: { mvid: id } })
}

</script>
<style lang='scss' scoped>
.mv-sheet {
    user-select: none;

    .mv-sheet-li {
        width: calc(50% - 30px);
        display: inline-block;
        margin: var(--main-margin);

        span {
            display: inline-block;

            font: {
                size: 16px;
                weight: 700;
                family: Arial, Helvetica, sans-serif;
            }
        }

        .newsong {
            display: flex;
            cursor: pointer;

            .img-box {
                position: relative;

                .play {
                    top: 50%;
                    left: 50%;
                    display: none;
                    transform: translate(-50%, -50%);
                    position: absolute;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background-color: #ffffff;

                    i {
                        font-size: 14px;
                        color: #f85b5b;
                    }
                }
            }

            .newsong-text {
                flex-grow: 1;
                flex-direction: column;
                @include _flex(center, flex-start);
                flex-wrap: wrap;
                margin-left: 25px;
                white-space: pre-wrap; //允许换行

                span {
                    &:nth-child(1) {
                        padding-bottom: 20px;
                    }

                    &:nth-child(2) {
                        padding-bottom: 5px;
                        font-size: 16px;
                        font-weight: 400;
                        color: rgb(238, 109, 109);
                    }
                }

                &-time {
                    margin: auto 0;
                    color: rgb(125, 162, 197);
                }
            }

            &:hover .img-box .play {
                display: flex;
            }
        }
    }
}

.image-slot {
    @include _imgslot(120px, 120px, 18px);
}
</style>