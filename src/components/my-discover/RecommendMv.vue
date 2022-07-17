<template>
    <div class="recommend-mv">
        <div class="recommend-mv-head">
            <span>推荐MV</span>
        </div>
        <div class="recommend-mv-show">
            <ul>
                <li v-for="(data, index) in recommendMv" :key="index" class="recommend-mv-show-li">
                    <div class="newsong">
                        <el-image style="min-width: 120px; min-height: 120px;" :src="data?.picUrl + '?param=120y120'" fit="fill">
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
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getPersonalizedMv } from '@/api/http/api';; //推荐mv
import { ref, onMounted } from 'vue';
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { changetime } from '@/hook';
const recommendMv = ref<any>();
async function Personalized() {
    let { result } = await getPersonalizedMv();
    recommendMv.value = result
    // newsong.value = recommendMv;
};

onMounted(() => Personalized());
function changeData(msg: { name: string }[]) {
    let newarr = msg.map(item => {
        return item.name;
    }).join("\n");
    return newarr;
}
</script>

<style lang="scss" scoped>
.recommend-mv {
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
    }
}

.image-slot {
    @include _imgslot(120px, 120px, 18px);
}
</style>