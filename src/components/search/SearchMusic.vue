<template>
    <div class="history-search-box" v-if="status">
        <ul class="history-search" v-if="searchHistory.length">
            <li class="tag-title">搜索历史
                <i class="iconfont icon-lajitong" title="清空搜索记录" @click.stop="clearHistorySearch"></i>
            </li>
            <li class="history-box" v-for="item of searchHistory" :key="item" @click="turnSearchPage(item)">
                <span class="keyword">{{ item }}</span>
                <i class="iconfont icon-cuowu" @click.stop="deleteHistorySearch(item)" title="删除记录"></i>
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
    <div class="suggest-search" v-else>
        <div class="info-type" v-for="item, index in suggest">
            <i class="iconfont" :class="fontIcon[index].icon"></i>
            {{ fontIcon[index].name }}
            <p class="keyword-info" v-for="i in item" @click="turnSearchPage(i.name)">
                {{ i.name }}
            </p>
        </div>
    </div>
</template>
<script lang='ts' setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { searchStorage as storage } from '@/util';
import { SearchSuggestType } from '@/models'
interface HotSearchProps {
    item: {
        content?: string;
        iconUrl?: string;
        score: number;
        searchWord: string;
    }[];
    suggest: SearchSuggestType;
    status: boolean;
}
const props = withDefaults(defineProps<HotSearchProps>(), {
    status: true,
});
const emits = defineEmits(['close', 'searchword'])
const router = useRouter();
const searchHistory = ref<string[]>([]);

const fontIcon = {
    albums: {
        icon: 'icon-zhuanji',
        name: '专辑',
    },
    artists: {
        icon: 'icon-User',
        name: '歌手',
    },
    playlists: {
        icon: 'icon-gedan1',
        name: '歌单'
    },
    songs: {
        icon: 'icon-music_play',
        name: '歌曲'
    },
}

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
    getHistorySearch(searchWord);
    emits('close'); // 关闭弹窗
}

// 添加搜索历史
const getHistorySearch = (searchWord?: string) => {
    storage.addSingleSearch('searchHistory', searchWord);
    searchHistory.value = storage.get('searchHistory');
}

// 删除某一条信息
const deleteHistorySearch = (searchWord: string) => {
    storage.deleteSingleSearch('searchHistory', searchWord);
    searchHistory.value = storage.get('searchHistory');
}

// 清空搜索历史
const clearHistorySearch = () => {
    storage.clear('searchHistory');
    storage.set('searchHistory', []);
    searchHistory.value = storage.get('searchHistory');
}


onMounted(() => {
    getHistorySearch(); // 初始化请求搜索历史
})

defineExpose({
    getHistorySearch,
})

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
                        height: 13px;
                        object-fit: contain;
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
            margin-bottom: 15px;

            .icon-lajitong {
                margin: 0 5px;
                cursor: pointer;
            }
        }

        .history-box {
            position: relative;
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

            &:hover .icon-cuowu {
                display: inline-block;
            }

            .keyword {
                margin-right: 5px;
            }

            .icon-cuowu {
                position: absolute;
                right: 5px;
                top: 50%;
                font-size: 12px;
                display: none;
                transform: translateY(-50%) scale(0.8);
            }
        }
    }

}

.suggest-search {
    width: 100%;
    height: 100%;
    font-size: 15px;
    box-sizing: border-box;
    padding: 15px 15px 0 15px;
    color: #898989;

    .info-type {
        margin-bottom: 12px;

        .keyword-info {
            margin: 5px;
            padding: 5px;
            cursor: pointer;
            white-space: nowrap;
            color: #383838;
            font-size: 13px;

            &:hover {
                background-color: #f2f2f2;
            }
        }
    }
}
</style>