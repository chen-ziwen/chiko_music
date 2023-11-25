<template>
    <div class="my-carousel">
        <el-skeleton :loading="loading" animated>
            <template #template>
                <el-skeleton-item v-for="i in 3" :key="i" class="skeleton-img" variant="image" />
            </template>
            <template #default>
                <el-carousel :interval="5000" type="card" height="260px" indicator-position="none" ref="carousel"
                    :autoplay="true">
                    <el-carousel-item v-for="data, index in myBanner" :key="index">
                        <el-image style="width: 100%; height: 260px;" :src="data.imageUrl" fit="fill">
                            <template #placeholder>
                                <div class="image-slot">
                                    <el-icon>
                                        <icon-picture />
                                    </el-icon>
                                </div>
                            </template>
                        </el-image>
                    </el-carousel-item>
                </el-carousel>
            </template>
        </el-skeleton>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getBanner } from '@/api/http/api';
import { Picture as IconPicture } from '@element-plus/icons-vue';
import { ElSkeleton } from 'element-plus';
const myBanner = ref<{ imageUrl: string }[]>();
const carousel = ref();
const loading = ref(true);
async function banners() {
    try {
        let { banners } = await getBanner();
        myBanner.value = banners;
        loading.value = false;
    } catch (e) {
        console.log(e, 'banner get fail =====>');
    }
}
onMounted(async () => {
    await banners();
    carousel.value.setActiveItem(0); // 解决第一张不显示问题
});
</script>

<style lang="scss" scoped>
$h: 260px;

.my-carousel {
    margin-top: 25px;
    margin-bottom: -25px;

    .el-skeleton {
        display: flex;
        justify-content: space-between;

        .skeleton-img {
            flex: 1;
            height: $h;
            margin-right: 30px;
            background-color: white;

            &:last-child {
                margin: 0;
            }
        }
    }
}

.image-slot {
    @include _imgslot(100%, $h, 16px);
}
</style>