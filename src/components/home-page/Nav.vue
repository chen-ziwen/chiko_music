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
                        <a href="https://github.com/chen-ziwen/chiko_music" target="_blank">GitHub</a>
                    </li>
                </ul>
                <div class="nav-right">
                    <SearchMusic></SearchMusic>
                </div>
                <span class="nav-login" @click="login">登陆</span>
            </div>
        </div>
    </nav>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import SearchMusic from '@/components/search/SearchMusic.vue';
const router = useRouter();
const login = () => router.push('/login');

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
    }

    .nav-login {
        margin: 0px 25px 2px 15px;
        cursor: pointer;
        color: #ffffff;
    }
}
</style>
