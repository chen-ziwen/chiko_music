<template>
    <div class="history-search-box">
        <ul class="history-search" v-if="searchHistory.length">
            <li class="tag-title">历史搜索</li>
            <li class="history-box" v-for="item of searchHistory" :key="item">
                {{ item }}
            </li>
        </ul>
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
    </div>
</template>
<script lang='ts' setup>
import { useRouter } from 'vue-router';

interface HotSearchProps {
    item: {
        content?: string;
        iconUrl?: string;
        score: number;
        searchWord: string;
    }[];
    searchHistory: string[];
}
const props = defineProps<HotSearchProps>();
const emits = defineEmits(['close', 'searchword'])
const router = useRouter();

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
    emits('searchword', searchWord);
    emits('close'); // 关闭弹窗
}

</script>
<style lang='scss' scoped>
.history-search-box {

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

        .judge-change {
            .order {
                color: #ff0000 !important;
            }

            .searchword {
                font-weight: 700;
            }
        }
    }

    .history-search {
        width: 100%;
        height: 100%;
        padding: 15px 15px 0 20px;
        font-size: 15px;
        box-sizing: border-box;
        color: #666666;

        .tag-title {
            margin-bottom: 10px;
        }

        .history-box {
            display: inline-block;
            padding: 5px 15px;
            margin: 0 6px 6px 0;
            border: 1px solid #ccccce;
            border-radius: 20px;
            font-size: 13px;
            cursor: pointer;

            &:hover {
                background-color: #f2f2f2;
            }
        }
    }

}
</style>