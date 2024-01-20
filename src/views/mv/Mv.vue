<template>
    <div class="mv">
        <div class="module-gap">
            <ListModule head="最新MV" gap-color="red" head-style="head-point" @turn="turnMvSort('frist')">
                <MvList :list="mvFristList" @mvid="turnMvDetail" v-if="mvFristList.length" />
                <Loading v-else :min-height="200" />
            </ListModule>
        </div>
        <div class="module-gap">
            <ListModule head="最热MV" gap-color="blue" head-style="head-point" @turn="turnMvSort('hot')">
                <MvList :list="mvHotList" @mvid="turnMvDetail" v-if="mvHotList.length" />
                <Loading v-else :min-height="200" />
            </ListModule>
        </div>
        <div class="module-gap">
            <ListModule head="网易云出品MV" gap-color="green" head-style="head-point" @turn="turnMvSort('yun')">
                <MvList :list="mvYun" @mvid="turnMvDetail" v-if="mvYun.length" />
                <Loading v-else :min-height="200" />
            </ListModule>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import ListModule from '@/components/common/ListModule.vue';
import { getMvAllUp, getMvFirst, getMvExclusive } from '@/api';
import { MvType, useMv } from '@/util';
import { useRouter } from 'vue-router';
import Loading from '@/components/common/loading/Loading.vue';
import MvList from '@/components/mv/MvList.vue';

interface Params {
    [key: string]: string | number;
}

const router = useRouter();
const mvFristList = ref<MvType[]>([]);
const mvHotList = ref<MvType[]>([]);
const mvYun = ref<MvType[]>([]);
const params: Params = {
    area: '全部',
    type: '全部',
    order: '最新',
    limit: 32,
    offset: 0
}

function turnMvSort(key: string) {
    switch (key) {
        case 'frist':
            params.type = "全部";
            params.order = "最新";
            break;
        case 'hot':
            params.type = "全部";
            params.order = "最热";
            break;
        case 'yun':
            params.type = "网易出品";
            params.order = "最热";
            break;
    }
    router.push({ name: 'mvsort', query: params })
}

async function mvFrist() {
    try {
        const { data } = await getMvFirst(12);
        mvFristList.value = useMv(data);
    } catch (e) {
        console.error(e, 'new mv fail ======>');
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
        console.error(e, 'hot mv fail ======>');
    }
}

async function mvWangYiYun() {
    try {
        const { data } = await getMvExclusive(12);
        mvYun.value = useMv(data);
    } catch (e) {
        console.error(e, 'wangyi yun fail ======>');
    }
}

const turnMvDetail = (id: number) => {
    router.push({ name: 'mvdetail', query: { mvid: id } })
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
        margin: 25px 0px;
    }
}
</style>