<template>
    <div class="recommend-singer">
        <div class="recommend-singer-head">
            <span>推荐歌手</span>
        </div>
        <div class="recommend-singer-show">
            <ul>
                <li v-for="data in artist" :key="data.id" class="recommend-singer-show-li">
                    <div class="singer-message">
                        <el-image :style="{ width: 80 + 'px', height: 80 + 'px', borderRadius: 40 + 'px' }" :src="data?.picUrl + '?param=200y200'">
                            <template #placeholder>
                                <div class="image-slot">
                                    <el-icon>
                                        <icon-picture />
                                    </el-icon>
                                </div>
                            </template>
                        </el-image>
                        <span>{{ data.name }}</span>
                        <span>
                            单曲数量
                            <span>{{ data.musicSize }}</span>
                        </span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import type { TopArtists } from "@/models/detail";
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { getTopArtists } from '@/api/http/api';
const artist = ref<TopArtists[]>();
async function topArtists() {
    let { artists } = await getTopArtists(40);
    artist.value = artists;
}
onMounted(() => topArtists())
</script>

<style lang="scss" scoped>
.recommend-singer {
    background-color: $color;
    width: $width;
    margin: 0 -15px;
    &-head {
        span {
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
                width: 10%;
                padding: 0px 15px 15px 15px;
                vertical-align: top;
                cursor: pointer;
                .singer-message {
                    width: 100%;
                    flex-direction: column;
                    @include _flex(center, center);
                    > span {
                        display: inline-block;
                        width: 100px;
                        text-align: center;
                        color: rgb(238, 109, 109);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        margin-top: 6px;
                        &:first-of-type {
                            color: rgb(67, 66, 66);
                            font: {
                                size: 18px;
                                weight: 700;
                                family: Arial, Helvetica, sans-serif;
                            }
                        }
                        font: {
                            size: 14px;
                            family: Arial, Helvetica, sans-serif;
                        }
                        span {
                            color: red;
                            font-style: italic;
                            font-weight: 700;
                        }
                    }
                }
            }
        }
    }
}
.image-slot {
    @include _imgslot(80px, 80px, 20px);
}
</style>