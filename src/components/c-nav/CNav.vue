<template>
    <nav class="music-nav">
        <div class="container flex-start">
            <div class="music-logo"><a href="#javascript"><img src="@/assets/image/logo2.png" class="music-logo-i"></a></div>
            <ul class="music-nav-ul">
                <li>
                    <router-link :to="{ name: 'singer' }" active-class="router-style">发现音乐</router-link>
                    
                </li>
                 <li>
                    <router-link :to="{ name: 'test' }" active-class="router-style">搜索歌曲</router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'ranklist' }" active-class="router-style">排行榜</router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'songsheet' }" active-class="router-style">歌单</router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'mv' }" active-class="router-style">MV</router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'newdisc' }" active-class="router-style">新碟</router-link>
                </li>
            </ul>
            <div class="nav-right">
                <el-icon :size="28" class="el-search" :color="searchColor" @mouseenter="searchColor='#ff0000'" @mouseleave="searchColor='#ffffff'">
                    <search />
                </el-icon>
                <span class="nav-login">登陆</span>
            </div>
        </div>
    </nav>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue';
import { ref } from 'vue';
const searchColor = ref<string>('#ffffff');

</script>

<style lang="scss" scoped>
.music-logo {
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    .music-logo-i {
     height: 65px;
    }
}
.music-nav {
    background-color: rgb(8,15,49);
    width: 100%; // div宽度占满整个窗口;
    height: 80px;
    min-width: 1240px; //div的最小宽度要和里面的内容一样大，因为content的宽度就是1024px;
    &-ul {
        display: flex;
        flex-grow: 1;
        justify-content: flex-start;
        align-items: center;
        height: 80px;

        li {
            height: 80px;
            display: inline-block;
            list-style: none;
            &:nth-of-type(1) {
                margin-left: 30px;
            }
            a {
                display: inline-block;
                text-decoration: none;
                padding: 0 20px;
                height: 80px;
                line-height: 80px;
                color: white;
            }
        }
    }
    .nav-right {
        display: flex;
        align-items: center;
        justify-content: center;
        .el-search {
            display: inline-block;
            cursor: pointer;
            padding-right: 15px;
            border-right: 1px dotted rgb(180, 177, 177);
        }
        .nav-login {
            padding: 0px 25px 0px 15px;
            display: inline-block;
            line-height: 100%;
            cursor: pointer;
            color: white;
        }
    }
    }
</style>
