<template>
    <div class="input-box" :class="{ 'search-box': searchBox }" v-close-outside="() => { content = false }">
        <input type="text" @click="getSearchContent" @keydown.enter="jumpPage(inputValue)" v-model="inputValue"
            placeholder="搜索：音乐/专辑/歌手/歌单/MV">
        <i class="iconfont icon-sousuo" title="搜索" @click="searchBox = !searchBox, content = false" />
        <div class="search-content-box" v-show="searchBox && content">
            <div class="history-search-box" v-if="suggestStatus">
                <ul class="history-search" v-if="history.length">
                    <li class="tag-title">搜索历史
                        <i class="iconfont icon-lajitong" title="清空搜索记录" @click.stop="clearHistory" />
                    </li>
                    <li class="history-list" v-for="item of history" :key="item" @click="jumpPage(item)">
                        <span class="keyword">{{ item }}</span>
                        <i class="iconfont icon-cuowu" @click.stop="delHistory(item)" title="删除记录" />
                    </li>
                </ul>
                <ul class="search-music">
                    <li class="tag-title">热搜榜</li>
                    <li class="search-list" v-for="data, index in hotList" :class="light(index)"
                        @click="jumpPage(data.searchWord)">
                        <span class="order">{{ index + 1 }}</span>
                        <div class="message-box">
                            <div class="message-title">
                                <span class="searchword text-hidden">{{ data.searchWord }}</span>
                                <img class="hot-icon" v-if="data.iconUrl" :src="data.iconUrl" alt="logo"
                                    @error="() => data.iconUrl = ''">
                                <span class="score">{{ data.score }}</span>
                            </div>
                            <p class="message-content text-hidden" v-if="data.content">{{ data.content }}</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="suggest-search" v-else>
                <div class="info-type" v-for="item, index in suggest">
                    <span class="icon-box">
                        <i class="iconfont" :class="fontIcon[index].icon" />
                        {{ fontIcon[index].name }}
                    </span>
                    <p class="keyword-info" v-for="i in item" @click="jumpPage(i.name)">{{ i.name }}</p>
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
const content = ref<boolean>(false);
const hotList = ref<SearchHotDetailType[]>([]);
const suggest = ref<SearchSuggestType>({});
const suggestStatus = ref<boolean>(true);
const debounce = new Debounce();
const history = ref<string[]>([]);

const fontIcon = {
    albums: { icon: 'icon-zhuanji', name: '专辑' },
    artists: { icon: 'icon-User', name: '歌手' },
    playlists: { icon: 'icon-gedan1', name: '歌单' },
    songs: { icon: 'icon-music_play', name: '歌曲' }
}

const light = (index: number) => index <= 2 ? "judge-change" : "";

// 添加搜索历史
const keepHistory = (searchWord?: string) => {
    storage.addSingleSearch('searchHistory', searchWord);
    history.value = storage.get('searchHistory');
}

// 删除某一条搜索历史
const delHistory = (searchWord: string) => {
    storage.deleteSingleSearch('searchHistory', searchWord);
    history.value = storage.get('searchHistory');
}

// 清空搜索历史
const clearHistory = () => {
    storage.remove('searchHistory');
    storage.set('searchHistory', []);
    history.value = storage.get('searchHistory');
}

const getSearchContent = () => {
    content.value = true;
    if (!hotList.value.length) {
        useGetSearchHotDetail();
    }
};

// 热搜列表
const useGetSearchHotDetail = async () => {
    try {
        const { data } = await getSearchHotDetail();
        hotList.value = data;
    } catch (e) {
        console.error(e, 'hot search fail =====>');
    }
};

// 搜索建议
const useGetSearchSuggest = async (key: string) => {
    try {
        const { result } = await getSearchSuggest(key);
        if (Object.keys(result).length) {
            suggest.value = {};
            for (let item of result.order) {
                suggest.value[item as keyof SearchSuggestType] = result[item];
            }
            if (inputValue.value) {
                suggestStatus.value = false;
            }
        } else {
            suggestStatus.value = true;
        }
    } catch (e) {
        suggestStatus.value = true;
        console.error(e, 'search suggest request fail =====>');
    }
};
const debounceSearchSuggest = debounce.use(useGetSearchSuggest, 300); // 对搜索限制 300ms 最多触发一次

const jumpPage = (searchWord: string) => {
    if (searchWord) {
        router.push({ name: 'searchpage', query: { searchWord } });
        inputValue.value = searchWord;
        keepHistory(searchWord);
        setTimeout(() => content.value = false, 150);
    }
};

// 当搜索框文字更新时触发
watch(inputValue, (val) => {
    content.value = true;
    if (val) {
        debounceSearchSuggest(val);
    } else {
        suggestStatus.value = true;
    }
})

onMounted(keepHistory);

</script>
<style lang='scss' scoped>
.input-box {
    position: relative;
    width: 1.5rem;
    height: 1.5rem;
    transition: all .2s ease-out;

    input {
        width: 100%;
        height: 100%;
        outline: none;
        border: none;
        padding: 0 10px 0 35px;
        visibility: hidden;
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
        transform: translateY(-50%);

        &:hover {
            color: #ff0000;
        }
    }

    .search-content-box {
        position: absolute;
        left: 0;
        top: 35px;
        min-width: 15rem;
        max-height: 20rem;
        border-radius: 5px;
        background-color: #ffffff;
        overflow: hidden scroll;

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

                        .icon-cuowu {
                            display: inline-block;
                        }
                    }

                    .keyword {
                        margin-right: 5px;
                    }

                    .icon-cuowu {
                        display: none;
                        position: absolute;
                        right: 5px;
                        top: 50%;
                        font-size: 12px;
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

                .icon-box {
                    display: flex;
                    align-items: center;

                    .iconfont {
                        padding-right: 5px;
                    }
                }

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

    input {
        background: #ffffff !important;
        visibility: visible !important;
    }

    .icon-sousuo {
        color: #080F31 !important;
        margin-left: 10px;
    }
}
</style>