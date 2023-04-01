<template>
    <div class="input-box" :class="{ 'search-box': searchBox }" v-close-outside="() => { searchContent = false }">
        <input class="input" type="text" @click="getSearchContent" @keydown.enter="turnSearchPage(inputValue)" v-model="inputValue" placeholder="搜索：音乐/专辑/歌手/歌单/MV">
        <i class="iconfont icon-sousuo" title="搜索" @click="searchBox = !searchBox, searchContent = false"></i>
        <div class="search-content-box" v-show="searchBox && searchContent">
            <div class="history-search-box" v-if="searchStatus">
                <ul class="history-search" v-if="searchHistory.length">
                    <li class="tag-title">搜索历史
                        <i class="iconfont icon-lajitong" title="清空搜索记录" @click.stop="clearHistorySearch"></i>
                    </li>
                    <li class="history-list" v-for="item of searchHistory" :key="item" @click="turnSearchPage(item)">
                        <span class="keyword">{{ item }}</span>
                        <i class="iconfont icon-cuowu" @click.stop="deleteHistorySearch(item)" title="删除记录"></i>
                    </li>
                </ul>
                <ul class="search-music">
                    <li class="tag-title">热搜榜</li>
                    <li class="search-list" v-for="data, index in hotSearchList" :key="index" :class="judgeChange(index)" @click="turnSearchPage(data.searchWord)">
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
                <div class="info-type" v-for="item, index in searchSuggest">
                    <i class="iconfont" :class="fontIcon[index].icon"></i>
                    {{ fontIcon[index].name }}
                    <p class="keyword-info" v-for="i in item" @click="turnSearchPage(i.name)">
                        {{ i.name }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang='ts' setup>
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { searchStorage as storage } from '@/util';
import { getSearchHotDetail, getSearchSuggest } from '@/api';
import type { SearchHotDetailType, SearchSuggestType } from '@/models';
import { Debounce } from '@/util';
const router = useRouter();
const inputValue = ref('');
const searchBox = ref<boolean>(false);
const searchContent = ref<boolean>(false);
const hotSearchList = ref<SearchHotDetailType[]>([]);
const searchSuggest = ref<SearchSuggestType>({});
const searchStatus = ref<boolean>(true); // 搜索状态
const debounce = new Debounce();
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

// 排行前三首样式
const judgeChange = (index: number) => {
    if (index <= 2) {
        return 'judge-change';
    }
    return '';
}

// 添加搜索历史
const getHistorySearch = (searchWord?: string) => {
    storage.addSingleSearch('searchHistory', searchWord);
    searchHistory.value = storage.get('searchHistory');
}

// 删除某一条搜索历史
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

const getSearchContent = () => {
    searchContent.value = true;
    // 如果热搜列表长度为0的时候请求，不做重复请求
    if (!hotSearchList.value.length) {
        useGetSearchHotDetail();
    }
};

// 热搜列表
const useGetSearchHotDetail = async () => {
    try {
        const { data } = await getSearchHotDetail();
        hotSearchList.value = data;
    } catch (e) {
        console.log(e, '热搜列表请求失败');
    }
};

// 搜索建议
const useGetSearchSuggest = async (key: string) => {
    try {
        const { result } = await getSearchSuggest(key);
        if (Object.keys(result).length > 0) {
            searchSuggest.value = {};
            // 对获取的信息进行排序
            for (let item of result.order) {
                searchSuggest.value[item as keyof SearchSuggestType] = result[item];
            }
            // 如果有搜索内容，显示搜索结果，否则显示推荐列表
            if (inputValue.value) {
                searchStatus.value = false;
            }
        } else {
            // 没有请求到数据的时候不显示搜索建议
            // 当搜索框为空时不显示搜索建议
            searchStatus.value = true;
        }
    } catch (e) {
        searchStatus.value = true;
        console.log(e, '搜索建议请求失败');
    }
};
const debounceSearchSuggest = debounce.use(useGetSearchSuggest, 300); // 对搜索限制 300ms 最多触发一次

const turnSearchPage = (searchWord: string) => {
    if (searchWord) {
        router.push({
            name: 'searchpage',
            query: {
                searchWord
            }
        });
        inputValue.value = searchWord; // 点击搜索时 将搜索值赋值给input
        searchContent.value = false // 关闭弹窗
        getHistorySearch(searchWord); // 保存搜索值
    }
};

// 当搜索框文字更新时触发
watch(inputValue, (val) => {
    if (val) {
        debounceSearchSuggest(val);
    } else {
        searchStatus.value = true;
    }
})

onMounted(() => {
    getHistorySearch(); // 初始化请求搜索历史
})

</script>
<style lang='scss' scoped>
.input-box {
    position: relative;
    width: 2rem;
    height: 2rem;
    transition: all .2s ease-out;

    .input {
        width: 100%;
        height: 100%;
        outline: none;
        border: none;
        padding-left: 35px;
        padding-right: 10px;
        box-sizing: border-box;
        border-radius: 15px;
        background-color: #080F31;

    }

    .icon-sousuo {
        position: absolute;
        top: 50%;
        left: 0;
        font-size: 22px;
        cursor: pointer;
        color: #ffffff;
        transform: translate(10px, -50%);

        &:hover {
            color: #ff0000;
        }
    }


    .search-content-box {
        position: absolute;
        left: 0;
        top: 35px;
        min-width: 10rem;
        max-height: 20rem; // 真正使用的时候需要
        border-radius: 5px;
        background-color: #ffffff;
        overflow: hidden scroll;
        transition: all 0.5s; // 宽度变化动画

        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-thumb {
            background-color: #d4d4d4;
            border-radius: 10px;
        }

        .suggset-search {
            background-color: red;
            width: inherit;
            height: inherit;

        }

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

                .search-list {
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
                                height: 10px;
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

                .history-list {
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
    }
}



.search-box {
    width: 15rem !important;
    height: 2rem !important;

    .input {
        background: #ffffff !important;
    }

    .icon-sousuo {
        color: #080F31 !important;
    }
}
</style>