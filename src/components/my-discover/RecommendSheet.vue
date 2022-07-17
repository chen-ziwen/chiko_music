<template>
    <div class="recommend-music">
        <div class="recommend-music-head">
            <span>{{ titlename }}</span>
        </div>
        <div class="recommend-music-show">
            <ul>
                <li v-for="(data, index) in sheetList" :key="index" class="recommend-music-show-li" @click="detailSheet(data)">
                    <el-image style="min-width: 125px; min-height: 125px; width: 100%;height: 100%;" :src="data?.picUrl + '?param=125y125'" fit="fill">
                        <template #placeholder>
                            <div class="image-slot">
                                <el-icon>
                                    <icon-picture />
                                </el-icon>
                            </div>
                        </template>
                    </el-image>
                    <span>{{ data.name }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { RecommendList } from "@/models/detail";
import { Picture as IconPicture } from '@element-plus/icons-vue';
import { useRouter } from "vue-router";

const props = defineProps<{ sheetList: RecommendList[], titlename?: string }>();
const router = useRouter();
function detailSheet(data: RecommendList) {
    router.push({ name: 'sheetlist', query: { id: data.id } })
}
</script>

<style lang="scss" scoped>
.recommend-music {
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
                width: calc(12.5% - 30px);
                margin: 10px 15px 10px 15px;
                vertical-align: top;
                cursor: pointer;

                span {
                    display: inline-block;

                    font: {
                        size: 16px;
                        weight: 700;
                        family: Arial, Helvetica, sans-serif;
                    }
                }
            }
        }
    }
}

.image-slot {
    @include _imgslot(125px, 125px, 30px);
}
</style>