<template>
    <ul class="singer-sheet">
        <li class="singer-sheet-list" v-for="data in singerList" :key="data.id">
            <div class="singer-message" @click="jumpPage(data.id)">
                <el-image class="singer-img" :class="type" :src="data?.picUrl + '?param=250y250'">
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
                    单曲数 <span>{{ data.musicSize || data.albumSize }}</span>
                </span>
            </div>
        </li>
    </ul>
</template>
<script lang='ts' setup>
import type { SingerListType } from "@/models";
import { useRouter } from "vue-router";
import { Picture as IconPicture } from '@element-plus/icons-vue'
interface SingerSheet {
    singerList: SingerListType[];
    type?: "square" | "round";
}
withDefaults(defineProps<SingerSheet>(), {
    type: "round"
});
const router = useRouter();
const jumpPage = (id: number) => { router.push({ name: 'singerdetails', query: { singerid: id } }) };

</script>
<style lang='scss' scoped>
.singer-sheet {
    .singer-sheet-list {
        width: calc(10% - 30px);
        display: inline-block;
        margin: var(--main-margin);
        vertical-align: top;

        &:hover .singer-img {
            box-sizing: border-box;
            border: 1px solid rgb(246, 67, 67);
        }

        .singer-message {
            width: 100%;
            flex-direction: column;
            @include _flex(center, center);
            margin-bottom: 10px;
            cursor: pointer;

            .singer-img {
                width: 85px;
                height: 85px;
                border-radius: 5px;
                box-shadow: 0 0 3px #4e4e4e;

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
    @include _imgslot(85px, 85px, 20px);
}

.round {
    border-radius: 50% !important;
}
</style>