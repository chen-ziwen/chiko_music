<template>
    <div class="recommend-new">
        <div class="recommend-new-head">
            <span>新歌首发</span>
        </div>
        <div class="recommend-new-show">
            <ul>
                <li v-for="(data, index) in newsong" :key="index" class="recommend-new-show-li">
                    <div class="newsong">
                        <el-image style="min-width: 100px; min-height: 100px;border-radius: 20px;" :src="data?.picUrl + '?param=100y100'" fit="cover">
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
                            <span>{{ changeData(data?.song?.artists) }}</span>
                        </div>
                        <div class="newsong-text-time">
                            <span>{{ changetime(data.song.duration) }}</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getPersonalizedNewsong } from '@/api/http/api';
import { ref, onMounted } from 'vue';
import type { Newsong } from '@/models/detail';
import { changetime } from '@/utils/ways';
import { Picture as IconPicture } from '@element-plus/icons-vue'
const newsong = ref<Newsong[]>()
function Personalized() {
    getPersonalizedNewsong(12).then(res => {
        newsong.value = res.result;
    });

}
onMounted(() => Personalized());
function changeData(msg: { name: string }[]) {
    let newarr = msg.map(item => {
        return item.name;
    }).join("\n");
    return newarr;
}
</script>

<style lang="scss" scoped>
.recommend-new {
    background-color: $color;
    width: $width;
    margin: 0 -15px;

    &-head {
        >span {
            display: inline-block;
            text-align: start;
            margin: $margin_I;

            font: {
                size: 26px;
                weight: 700;
                family: Arial, Helvetica, sans-serif;
            }
        }
    }

    &-show {
        ul {
            li {
                display: inline-block;
                box-sizing: border-box;
                width: 33.3%;
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
    }
}

.image-slot {
    @include _imgslot(100px, 100px, 16px);
}
</style>