<template>
    <ul>
        <li v-for="(data, index) in mvSheet" :key="index" class="recommend-mv-show-li">
            <div class="newsong">
                <el-image class="mv-img" style="min-width: 120px; min-height: 120px;" :src="data?.picUrl + '?param=120y120'" fit="fill">
                    <template #placeholder>
                        <div class="image-slot">
                            <el-icon>
                                <icon-picture />
                            </el-icon>
                        </div>
                    </template>
                </el-image>
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
import { changetime, changeData } from '@/hook';

interface MvSheet {
    mvSheet: any[];
}
const props = defineProps<MvSheet>();

</script>
<style lang='scss' scoped>
ul {
    li {
        display: inline-block;
        box-sizing: border-box;
        width: 50%;
        padding: 10px 15px 10px 15px;
        // vertical-align: top;
        cursor: pointer;

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
        }
    }
}

.image-slot {
    @include _imgslot(120px, 120px, 18px);
}
</style>