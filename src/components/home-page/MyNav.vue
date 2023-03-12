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
                    <li>
                        <router-link :to="{ name: 'newdisc' }" active-class="router-style">新碟</router-link>
                    </li>
                </ul>
                <div class="nav-right">
                    <div class="input-box" :class="{ 'search-box': searchBox }" v-close-outside="() => { searchBox = false, searchContent = false }">
                        <input class="input" type="text" @focusin="getFocus" @focusout="outFocus" v-model="inputValue" placeholder="搜索：音乐/专辑/歌手/歌单/MV">
                        <i class="iconfont icon-sousuo" title="搜索" @click="searchBox = true"></i>
                        <div class="search-music-box" v-if="searchBox && searchContent">
                            <SearchMusic></SearchMusic>
                        </div>
                    </div>
                    <span class="nav-login" @click="login">登陆</span>
                </div>

            </div>
        </div>
    </nav>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SearchMusic from '../common/SearchMusic.vue';
const router = useRouter();
const inputValue = ref('');
const searchBox = ref<boolean>(false);
const searchContent = ref<boolean>(false);
const login = () => router.push('/login');

// 获得焦点
const getFocus = () => {
    searchContent.value = true;
}

// 失去焦点
const outFocus = () => {
    if (!searchBox.value) {
        searchContent.value = false;
    }
}
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
            width: 15rem;
            max-height: 20rem; // 真正使用的时候需要
            height: 200px; // 测试使用的时候需要
            border-radius: 5px;
            background-color: #ffffff;
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
