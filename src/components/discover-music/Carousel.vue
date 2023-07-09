<template>
    <div class="my-carousel">
        <el-carousel :interval="5000" type="card" height="260px" indicator-position="none" ref="carousel" :autoplay="true">
            <el-carousel-item v-for="data, index in myBanner" :key="index">
                <el-image style="width: 100%; height: 260px;" :src="data?.imageUrl" fit="fill">
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
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getBanner } from '@/api/http/api';
import { Picture as IconPicture } from '@element-plus/icons-vue';
const myBanner = ref<any>();
const carousel = ref();
async function banners() {
    try {
        let { banners } = await getBanner();
        myBanner.value = banners;
    }
    catch (e) {
        console.log('banner获取失败');
    }
}
onMounted(() => {
    banners();
    setTimeout(() => {
        carousel.value.setActiveItem(0); //解决第一张不显示问题
    }, 200);
})
</script>

<style lang="scss" scoped>
.my-carousel {
    margin-top: 25px;
    margin-bottom: -25px
}

.image-slot {
    @include _imgslot(100%, 260px, 16px);
}
</style>