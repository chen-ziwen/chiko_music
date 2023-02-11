<template>
    <div class="mv">
        <div class="module-gap">
            <ListModule head="最新MV" gap-color="red" head-style="head-point" @turn="turnMvDetail('frist')">
                <MvList :list="mvFristList"></MvList>
            </ListModule>
        </div>
        <div class="module-gap">
            <ListModule head="最热MV" gap-color="blue" head-style="head-point" @turn="turnMvDetail('hot')">
                <MvList :list="mvHotList"></MvList>
            </ListModule>
        </div>
        <div class="module-gap">
            <ListModule head="网易云出品MV" gap-color="green" head-style="head-point" @turn="turnMvDetail('yun')">
                <MvList :list="mvYun"></MvList>
            </ListModule>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import ListModule from '@/components/common/ListModule.vue';
import { getMvAllUp, getMvFirst, getMvExclusive } from '@/api';
import { MvType, useMv } from '@/hook';
import { useRouter } from 'vue-router';
import MvList from '@/components/mv/MvList.vue';

interface Params {
    [key: string]: string | number;
}

const router = useRouter();
const mvFristList = ref<MvType[]>([]);
const mvHotList = ref<MvType[]>([]);
const mvYun = ref<MvType[]>([]);
let params: Params = {}

function turnMvDetail(key: string) {
    switch (key) {
        case 'frist':
            params = {
                area: '全部',
                type: '全部',
                order: '最新',
                limit: 32,
                offset: 0
            }
            break;
        case 'hot':
            params = {
                area: '全部',
                type: '全部',
                order: '最热',
                limit: 32,
                offset: 0
            }
            break;
        case 'yun':
            params = {
                area: '全部',
                type: '网易出品',
                order: '最热',
                limit: 32,
                offset: 0
            }
            break;
    }
    router.push({ name: 'mvsort', query: params })
}

async function mvFrist() {
    try {
        const { data } = await getMvFirst(12);
        mvFristList.value = useMv(data);
    } catch (e) {
        console.log(e, '最新mv请求失败');
    }
}

async function mvHot() {
    const mvListType = {
        area: '全部',
        type: '全部',
        order: '最热',
        limit: 12,
        offset: 0
    }
    try {
        const { data } = await getMvAllUp(mvListType);
        mvHotList.value = useMv(data);
    } catch (e) {
        console.log(e, '最热mv请求失败');
    }
}

async function mvWangYiYun() {
    try {
        const { data } = await getMvExclusive(12);
        mvYun.value = useMv(data);
    } catch (e) {
        console.log(e, '网易云出品mv请求失败');
    }
}
onMounted(() => {
    mvFrist();
    mvHot();
    mvWangYiYun();
})
</script>

<style lang="scss" scoped>
.mv {
    .module-gap {
        margin: 20px 0px;
    }
}
</style>