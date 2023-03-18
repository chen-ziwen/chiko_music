<template>
    <nav class="nav">
        <div class="music-nav">
            <div class="container flex-start">
                <div class="music-logo">
                    <a href="#javascript">
                        <img src="@/assets/image/logo2.png" class="music-logo-i" />
                    </a>
                </div>
                <ul class="music-nav-ul">
                    <li>
                        <router-link :to="{ name: 'discover' }" active-class="router-style">发现音乐</router-link>
                    </li>

                    <li>
                        <router-link :to="{ name: 'ranklist' }" active-class="router-style">排行榜</router-link>
                    </li>

                    <li>
                        <router-link :to="{ name: 'songsheet' }" active-class="router-style">歌单</router-link>
                    </li>

                    <li>
                        <router-link :to="{ name: 'singer' }" active-class="router-style">歌手</router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'mv' }" active-class="router-style">MV</router-link>
                    </li>
                    <!-- <li>
                        <router-link :to="{ name: 'newdisc' }" active-class="router-style">新碟</router-link>
                    </li> -->
                    <li>
                        <a href="https://github.com/chen-ziwen/chiko_music" target="_blank">GitHub</a>
                    </li>
                </ul>
                <div class="nav-right">
                    <div class="input-box" :class="{ 'search-box': searchBox }" v-close-outside="() => { searchBox = false, searchContent = false }">
                        <input class="input" type="text" @focusin="getFocus" @focusout="outFocus" @keydown.enter="turnSearchPage(inputValue)" v-model="inputValue" placeholder="搜索：音乐/专辑/歌手/歌单/MV">
                        <i class="iconfont icon-sousuo" title="搜索" @click="searchBox = true"></i>
                        <div class="search-music-box" v-if="searchBox && searchContent">
                            <SearchMusic ref="searchmusic" :suggest="searchSuggest" :item="hotSearchList" :status="searchStatus" @close="searchBox = false"></SearchMusic>
                        </div>
                    </div>
                    <span class="nav-login" @click="login">登陆</span>
                </div>
            </div>
        </div>
    </nav>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import SearchMusic from '@/components/search/SearchMusic.vue';
import { getSearchHotDetail, getSearchSuggest } from '@/api';
import type { SearchHotDetailType, SearchSuggestType } from '@/models';
const router = useRouter();
const inputValue = ref('');
const searchBox = ref<boolean>(false);
const searchContent = ref<boolean>(false);
const hotSearchList = ref<SearchHotDetailType[]>([]);
const searchSuggest = ref<SearchSuggestType>({});
const searchStatus = ref<boolean>(true); // 搜索状态
const searchmusic = ref<any>(null); // 获取组件实例
const login = () => router.push('/login');

// 获得焦点
const getFocus = async () => {
    searchContent.value = true;
    // 如果热搜列表长度为0的时候请求，不做重复请求
    if (!hotSearchList.value.length) {
        await useGetSearchHotDetail();
        console.log(hotSearchList.value, 'chufale');
    }
}

// 失去焦点
const outFocus = () => {
    if (!searchBox.value) {
        searchContent.value = false;
    }
}

// 热搜列表
const useGetSearchHotDetail = async () => {
    try {
        const { data } = await getSearchHotDetail();
        hotSearchList.value = data;
    } catch (e) {
        console.log(e, '热搜列表请求失败');
    }
}

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
            searchStatus.value = false; // 不显示热搜
        } else {
            // 没有请求到数据的时候不显示搜索建议
            // 当搜索框为空时不显示搜索建议
            searchStatus.value = true;
        }
    } catch (e) {
        searchStatus.value = true;
        console.log(e, '搜索建议请求失败');
    }
}

const turnSearchPage = (searchWord: string) => {
    if (searchWord) {
        router.push({
            name: 'searchpage',
            query: {
                searchWord
            }
        });
        searchBox.value = false // 关闭弹窗
        if (searchmusic.value) {
            searchmusic.value.getHistorySearch(searchWord);
        }
    }
}

// 当搜索框文字更新时触发
watch(inputValue, async (val) => {
    await useGetSearchSuggest(val);
})

</script>

<style lang="scss" scoped>
.music-logo {
    height: 80px;
    @include _flex(center, center);

    &-i {
        height: 65px;
    }
}

.nav {
    width: 100%;
    height: 80px;
}

.music-nav {
    z-index: 2001;
    position: fixed;
    top: 0px;
    background-color: rgb(8, 15, 49);
    width: 100%; // div宽度占满整个窗口;
    height: 80px;
    min-width: $width; //div的最小宽度要和里面的内容一样大，因为content的宽度就是1024px;

    &-ul {
        flex-grow: 1;
        @include _flex(flex-start, center);
        height: 80px;

        >li {
            height: 80px;
            display: inline-block;

            &:nth-of-type(1) {
                margin-left: 30px;
            }

            >a {
                display: inline-block;
                padding: 0 20px;
                height: 80px;
                line-height: 80px;
                color: white;
                cursor: pointer;

                &:hover {
                    color: pink !important;
                }
            }
        }
    }

    .nav-right {
        position: relative;
        @include _flex(center, center);

        .input-box {
            position: relative;
            width: 2em;
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
        }

        .nav-login {
            margin: 0px 25px 2px 15px;
            cursor: pointer;
            color: #ffffff;
        }

        .search-music-box {
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
        }
    }
}

// 点击搜索框变大
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
