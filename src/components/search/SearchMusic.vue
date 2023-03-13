<template>
    <ul class="search-music">
        <li class="tag-title">热搜榜</li>
        <li class="search-box" v-for="data, index in item" :key="index" :class="judgeChange(index)" @click="turnSearchPage(data.searchWord)">
            <span class="order">{{ index + 1 }}</span>
            <div class="message-box">
                <div class="message-title">
                    <span class="searchword text-hidden">{{ data.searchWord }}</span>
                    <img class="hot-icon" v-if="data.iconUrl" :src="data.iconUrl" alt="logo" @error="() => data.iconUrl = ''">
                    <span class="score">{{ data.score }}</span>
                </div>
                <p class="message-content text-hidden" v-if="data.content">{{ data.content }}</p>
            </div>
        </li>
    </ul>
</template>
<script lang='ts' setup>
import { useRouter } from 'vue-router';
import { useStorage } from '@/util';
interface HotSearchProps {
    item: {
        content?: string;
        iconUrl?: string;
        score: number;
        searchWord: string;
    }[];
}
const props = defineProps<HotSearchProps>();
const emits = defineEmits(['close'])
const router = useRouter();
const storage = new useStorage();
const judgeChange = (index: number) => {
    if (index <= 2) {
        return 'judge-change';
    }
    return '';
}

const turnSearchPage = (searchWord: string) => {
    router.push({
        name: 'searchpage',
        query: {
            searchWord
        }
    });
    emits('close'); // 关闭弹窗
    // const message = storage.get("searcgHistory", "[]") as unknown as [];
    // if (message.length === 0) {
    //     storage.set("searcgHistory", [searchWord])
    // } else {
    //     const nData = [...storage.get("searcgHistory") as unknown as [], searchWord];
    //     storage.set("searcgHistory", nData);
    // }
    // console.log(storage.get("searcgHistory"));
}

</script>
<style lang='scss' scoped>
.search-music {
    width: 100%;
    height: 100%;
    font-size: 13px;
    color: #303030;

    .tag-title {
        color: #666666;
        font-size: 15px;
        margin: 15px 0 15px 20px;
    }


    .search-box {
        height: 50px;
        display: flex;
        flex-wrap: nowrap;
        margin: 5px 0;
        cursor: pointer;

        &:hover {
            background-color: #F2F2F2;
        }

        .order {
            width: 20px;
            padding: 0 15px;
            text-align: center;
            line-height: 50px;
            font-size: 16px;
            color: #cccccc;
        }

        .message-box {
            display: flex;
            flex-direction: column;
            justify-content: center;

            .message-title {

                .hot-icon {
                    width: 22px;
                }

                .searchword,
                .hot-icon,
                .score {
                    padding-right: 5px;
                }

                .score {
                    color: #cccccc;
                }
            }

            .message-content {
                margin-top: 5px;
                color: #cccccc;
            }
        }
    }
}

// judge-change 
.judge-change {
    .order {
        color: #ff0000 !important;
    }

    .searchword {
        font-weight: 700;
    }
}
</style>