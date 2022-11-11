<template>
    <div class="music-singer container">
        <!-- 我是歌手页面 -->
        <div class="singer-tags">
            <div class="tag-all">
                <i class="tag-text">语种 : </i>
                <ul class="langs">
                    <li v-for="(tag, index) of langs" :key="index" :class="checkHigh('langs', tag.value as number).langs" @click="checkTags('langs', tag.value as number)">
                        {{ tag.label }}
                    </li>
                </ul>
            </div>
            <div class="tag-all">
                <i class="tag-text">分类 : </i>
                <ul class="singer">
                    <li v-for="(tag, index) of singer" :key="index" :class="checkHigh('singer', tag.value as number).singer" @click="checkTags('singer', tag.value as number)">
                        {{ tag.label }}
                    </li>
                </ul>
            </div>
            <div class="tag-all">
                <i class="tag-text">筛选 : </i>
                <ul class="ens">
                    <li v-for="(tag, index) of ens" :key="index" :class="checkHigh('ens', tag.value as number).ens" @click="checkTags('ens', tag.value as number)">
                        {{ tag.label }}
                    </li>
                </ul>
            </div>
        </div>
        <LoadScroll @load-scorll="loadScroll" :distance="100">
            <SingerSheet :singer-list="singerList" type="square"></SingerSheet>
        </LoadScroll>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { getArtistAList } from '@/api/http/api';
import type { SingerListType } from '@/models';
import LoadScroll from '@/components/common/LoadScroll.vue';
import SingerSheet from '@/components/singer/SingerSheet.vue';

interface TagType {
    langs: Record<string, string | number>[],
    singer: Record<string, string | number>[],
    ens: Record<string, string | number>[],
}
interface Params {
    [key: string]: number;
}
const tagType: TagType = {
    // 语种tag
    langs: [
        { value: -1, label: "全部" },
        { value: 7, label: "华语" },
        { value: 96, label: "欧美" },
        { value: 8, label: "日本" },
        { value: 16, label: "韩国" },
        { value: 0, label: "其他" },
    ],
    // 歌手tag
    singer: [
        { value: -1, label: "全部" },
        { value: 1, label: "男歌手" },
        { value: 2, label: "女歌手" },
        { value: 3, label: "乐队" },
    ],
    // 字母tag
    ens: []
};

const params: Params = reactive({
    limit: 40, // 一次性请求数量
    offset: 0, // 换页偏移值
    type: -1,  // 语种
    area: -1,  // 男女歌手
    initial: -1, // 26字母
})

const singerList = ref<SingerListType[]>([]);

// 获得26个大写字母
const createEns = () => {
    const ens = [];
    for (var i = 65; i < 91; i++) {
        ens.push({
            value: String.fromCharCode(32 + i),
            label: String.fromCharCode(i)
        });
    }
    ens.unshift({
        value: -1,
        label: "热门",
    });
    ens.push({
        value: 0,
        label: "其他",
    })
    tagType.ens = ens;
    return ens;
}
createEns() // 必须在mounted之前执行
const { langs, singer, ens } = tagType // 三个歌手类别

// 选中不同标签时，更新param请求参数
const checkTags = (name: string, tag: number) => {
    if (name == 'langs') {
        params.area = tag
    } else if (name == 'singer') {
        params.type = tag
    } else if (name == 'ens') {
        params.initial = tag;
    }
    alongSingerList(params);
}

// 选中高亮
const checkHigh = (name: string, tag: number) => {
    const high = { langs: '', singer: '', ens: '' }
    if (name == 'langs' && params.area == tag) {
        high.langs = "high"
    } else if (name == 'singer' && params.type == tag) {
        high.singer = "high"
    } else if (name == 'ens' && params.initial == tag) {
        high.ens = "high"
    }
    return high;
}

// 切换标签时，清空缓存 单独请求
const alongSingerList = async (parm: Params) => {
    try {
        params.offset = 0;
        singerList.value.splice(0, singerList.value.length);
        const { artists } = await getArtistAList(parm);
        singerList.value = artists;
    } catch (e) {
        console.log(e, '歌手列表请求失败');
    }
}

// 根据标签获取歌手列表 滚动请求
const getSingerList = async (parm: Params) => {
    try {
        params.offset += 40; // 滚动一次 增加40条数据
        const { artists, more } = await getArtistAList(parm);
        if (more) {
            singerList.value = singerList.value.concat(artists);
        } else {
            return;
        }
    } catch (e) {
        console.log(e, '歌手列表请求失败');
    }
}

// 滚动条到底 触发请求api
const loadScroll = () => {
    getSingerList(params);
}

onMounted(() => {
    alongSingerList(params) // 初始化请求
})

</script>

<style lang="scss" scoped>
.music-singer {
    background-color: $color;
    margin: 0 auto;
    .singer-tags {
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
                color: rgb(88,88,88);
                font-weight: 600;
            }
        }

    .langs,.singer,.ens {
        color: rgb(99, 99, 99);
        
       li {
        display: inline-block;
        padding: 3px;
        margin: 0 10px;
        cursor:pointer;
        width: 60px;
        text-align: center;
       } 
    }
    .ens {
        li {
            margin-bottom: 15px;
            
        }
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