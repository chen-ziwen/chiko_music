<template>
    <router-link :to="{ name: 'singer' }" active-class="router-style">切换到其他</router-link>
    <br />

    <router-link :to="{ name: 'test' }" active-class="router-style">搜索歌曲</router-link>
    <router-link :to="{ name: 'songsheet' }" active-class="router-style">歌单</router-link>
    <router-link :to="{ name: 'ranklist' }" active-class="router-style">排行榜</router-link>
    <router-link :to="{ name: 'mv' }" active-class="router-style">mv</router-link>
    <router-link :to="{ name: 'newdisc' }" active-class="router-style">新碟</router-link>
    <!-- <router-link :to="{ name: 'login' }">登陆界面</router-link> -->
    <article class="music-main">
        <Router-view></Router-view>
        </article>
</template>

<script lang="ts" setup>



</script>
<style lang="scss" scoped>.music-main {
    background-color: yellowgreen;
    width: 100%;
    height: 1000px;
}</style>