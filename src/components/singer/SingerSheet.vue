<template>
    <ul>
        <li v-for="data in singerList" :key="data.id" class="recommend-singer-show-li">
            <div class="singer-message" @click="jumpPage(data.id)">
                <el-image class="singer-img" :src="data?.picUrl + '?param=250y250'">
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
</template>
<script lang='ts' setup>
import type { SingerListType } from "@/models";
import { useRoute, useRouter } from "vue-router";
import { Picture as IconPicture } from '@element-plus/icons-vue'
interface SingerSheet {
    singerList: SingerListType[]
}
const props = defineProps<SingerSheet>();
const router = useRouter();

const jumpPage = (id: number) => {
    router.push({
        name: 'singerdetails',
        query: {
            id,
        }
    })
}


</script>
<style lang='scss' scoped>
ul {
    li {
        display: inline-block;
        box-sizing: border-box;
        width: calc(10% - 30px);
        margin: 0px 15px 15px 15px;
        vertical-align: top;
        cursor: pointer;

        .singer-message {
            width: 100%;
            flex-direction: column;
            @include _flex(center, center);
            margin: 10px 0;

            .singer-img {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                ;
            }

            >span {
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

.image-slot {
    @include _imgslot(80px, 80px, 20px);
}
</style>