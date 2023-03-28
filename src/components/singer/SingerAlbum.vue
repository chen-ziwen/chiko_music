<template>
    <ul class="singer-album">
        <li class="singer-album-list" v-for="item in data" :key="item.id" @click="turnSheet(item.id)">
            <div class="album-img-box">
                <el-image class="album-img" :src="item.picUrl + '?param=250y250'">
                    <template #placeholder>
                        <div class="image-slot">
                            <el-icon>
                                <icon-picture />
                            </el-icon>
                        </div>
                    </template>
                </el-image>
                <div class="album-back"></div>
            </div>
            <span class="singer-name">{{ item.name }}</span>
            <span class="album-time">{{ dayjs(item.publishTime).format('YYYY-MM-DD') }}</span>
        </li>
    </ul>
</template>
<script lang='ts' setup>
import { SingerAlbumType } from '@/models';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { Picture as IconPicture } from '@element-plus/icons-vue';
const props = defineProps<{ data: SingerAlbumType[] }>();
const router = useRouter();
const turnSheet = (id: number) => {
    router.push({ name: 'albumlist', query: { albumid: id } })
}
</script>
<style lang='scss' scoped>
.singer-album {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;

    .singer-album-list {
        display: flex;
        flex-direction: column;
        width: calc(20% - 80px);
        margin: 0 40px;
        cursor: pointer;

        &:hover .singer-name {
            color: rgb(237, 93, 93) !important;
        }

        .album-img-box {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;

            &:hover .album-back {
                right: -32px;
            }


            .album-img {
                position: relative;
                width: 100%;
                border-radius: 10px;
                box-shadow: 3px 3px 8px gray;

                .image-slot {
                    @include _imgslot(155px, 155px, 30px);
                }

                z-index: 10;
            }

            .album-back {
                position: absolute;
                content: '';
                display: block;
                width: 140px;
                height: 140px;
                border-radius: 50%;
                background-color: rgba(44, 44, 4);
                right: -25px;
                transition: all 0.25s;

                &::after,
                &::before {
                    content: '';
                    display: block;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    border: 1px solid rgb(111, 110, 110, 0.3);
                }

                &::before {
                    width: 100px;
                    height: 100px;
                }
            }

        }

        .singer-name {
            margin-top: 5px;
        }

        .album-time {
            margin: 6px 0 15px 0;
            font-size: 13px;
            color: #7d7d7d;
        }
    }
}
</style>