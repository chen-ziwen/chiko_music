<template>
    <div class="mv-sort container">
        <div class="mv-tags">
            <div class="tag-all">
                <i class="tag-text">地区 : </i>
                <ul class="area">
                    <li class="area-li" v-for="(tag, index) of area" :key="index">
                        <span class="tag-label" :class="checkHigh('area', tag.value).area" @click="checkTags('area', tag.value)">{{ tag.label }}</span>
                    </li>
                </ul>
            </div>
            <div class="tag-all">
                <i class="tag-text">分类 : </i>
                <ul class="type">
                    <li class="type-li" v-for="(tag, index) of type" :key="index">
                        <span class="tag-label" :class="checkHigh('type', tag.value).type" @click="checkTags('type', tag.value)">{{ tag.label }}</span>
                    </li>
                </ul>
            </div>
            <div class="tag-all">
                <i class="tag-text">排序 : </i>
                <ul class="order">
                    <li class="order-li" v-for="(tag, index) of order" :key="index">
                        <span class="tag-label" :class="checkHigh('order', tag.value).order" @click="checkTags('order', tag.value)">{{ tag.label }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <MvList :list="mvContnet" :style="{ marginTop: '40px' }" @mvid="turnMvDetail"></MvList>
        <el-pagination class="my-pagination" v-model:currentPage="currentPage" :page-size="32" layout="prev, pager, next" :total="mvCount" @current-change="currentChange" />
    </div>
</template>
<script lang='ts' setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getMvAllUp } from '@/api';
import { MvType, useMv } from '@/hook';
import MvList from '@/components/mv/MvList.vue';
import router from '@/router';

interface TagType {
    area: Record<string, string>[],
    type: Record<string, string>[],
    order: Record<string, string>[],
}
interface Params {
    [key: string]: string | number;
}

const route = useRoute();
const currentPage = ref<number>(1);

const tagType: TagType = {
    // 地区
    area: [
        { value: '全部', label: "全部" },
        { value: '内地', label: "内地" },
        { value: '港台', label: "港台" },
        { value: '欧美', label: "欧美" },
        { value: '韩国', label: "韩国" },
        { value: '日本', label: "日本" },
    ],
    // 类型
    type: [
        { value: '全部', label: "全部" },
        { value: '官方版', label: "官方版" },
        { value: '原声', label: "原声" },
        { value: '现场版', label: "现场版" },
        { value: '网易出品', label: "网易出品" },
    ],
    // 排序
    order: [
        { value: '上升最快', label: '上升最快' },
        { value: '最热', label: '最热' },
        { value: '最新', label: '最新' },
    ]
};

const { area, type, order } = tagType;

// 初始的请求参数 // 其实应该靠后续传进来
const params = ref<Params>({
    area: '',
    type: '',
    order: '',
    limit: 32,
    offset: 0
})

const mvContnet = ref<MvType[]>([]);
const mvCount = ref<number>(0); // 给初始值 不然会报错

// 选中不同标签时，更新param请求参数
const checkTags = (name: string, tag: string) => {
    if (name == 'area') {
        params.value.area = tag
    } else if (name == 'type') {
        params.value.type = tag
    } else if (name == 'order') {
        params.value.order = tag;
    }
    getMvTagContent(params.value)
}

// 选中高亮
const checkHigh = (name: string, tag: string) => {
    const high = { area: '', type: '', order: '' }
    if (name == 'area' && params.value.area == tag) {
        high.area = "high"
    } else if (name == 'type' && params.value.type == tag) {
        high.type = "high"
    } else if (name == 'order' && params.value.order == tag) {
        high.order = "high"
    }
    return high;
}

const currentChange = async (page: number) => {
    try {
        params.value.offset = (page - 1) * (params.value.limit as number);
        const { data } = await getMvAllUp(params.value);
        mvContnet.value = useMv(data);
    } catch (e) {
        console.log(e, 'mv页数切换失败');
    }
}
// 处理获取到的mv数据
async function getMvTagContent(param: Params) {
    try {
        currentPage.value = 1; // 重新切换到第一页
        params.value.offset = 0; // offset 从0 开始重新计算
        const { data, count } = await getMvAllUp(param);
        mvContnet.value = useMv(data);
        mvCount.value = count;

    } catch (e) {
        console.log(e, 'mv请求失败');
    }
}

// 跳转到mv详情
const turnMvDetail = (id: number) => {
    router.push({ name: 'mvdetail', query: { mvid: id } })
}


watch(() => route.query, (val) => {
    if (route.name == 'mvsort') {
        params.value = val as Params
        getMvTagContent(params.value);
    }
}, { immediate: true })


</script>
<style lang='scss' scoped>
.mv-sort {
    // height: 500px;
    margin: 0 auto;

    .mv-tags {

        .tag-all {
            display: flex;
            margin: 20px 0px;

            &:not(:last-of-type) {
                align-items: center;
            }

            .tag-text {
                width: 60px;
                display: inline-block;
                flex-shrink: 0;
                font-style: normal;
                color: rgb(88, 88, 88);
                font-weight: 600;
            }
        }

        .area,
        .type,
        .order {
            color: rgb(99, 99, 99);
            display: flex;
            justify-content: center;
            align-items: center;

            .area-li,
            .type-li,
            .order-li {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0 10px;
                width: 90px;

                &:not(:last-of-type) {
                    border-right: 1px solid rgb(203, 203, 203);
                }

                .tag-label {
                    padding: 3px 10px;
                    box-sizing: border-box;
                    cursor: pointer;
                }
            }
        }
    }

    .my-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 20px 0 10px 0;

    }

    &:deep(.el-pagination) {
        --el-pagination-hover-color: rgb(248, 60, 60);
        --el-pagination-bg-color: transparent;
        --el-pagination-text-color: #302424c2;
        --el-pagination-font-size: 18px;
        font-weight: 700;

        button:disabled {
            background-color: transparent;
        }
    }
}

.high {
    color: red !important;
    padding: 3px 6px;
    border-radius: 20px;
    background-color: #f9d4d4;
    transition: all 0.25s ease-in-out;
}
</style>