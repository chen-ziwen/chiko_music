<template>
    <div class="recommend-music">
        <div class="recommend-music-head">
            <span>推荐歌单</span>
        </div>
        <div class="recommend-music-show">
            <ul>
                <li v-for="(data, index) in sheet" :key="index" class="recommend-music-show-li" @click="detailSheet(data)">
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
import { onMounted, reactive, ref } from "vue";
import type { RecommendList } from "@/models/detail";
import { getRecommendList } from '@/api/http/api';
import { Picture as IconPicture } from '@element-plus/icons-vue';
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
// let recommend = reactive<{ list: RecommendList[] }>({ list: [] }); // reactive 不能直接赋值会丢失响应性
const sheet = ref<RecommendList[]>()  //ref可以直接赋值，不会丢失响应性 （两者打印出来一看就明白了） 
async function getRecommend() {
    let { result } = await getRecommendList(32);
    sheet.value = result;
    console.log('推荐歌单', sheet.value)
}
onMounted(() => getRecommend());
const router = useRouter();
onMounted(() => {
    console.log(router)
})
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
        > span {
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
                width: 12.5%;
                padding: 10px 15px 10px 15px;
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