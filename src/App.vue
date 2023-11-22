<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import router from './router';

router.beforeEach((to, from, next) => {
  document.title = <string>to.meta.title;
  next();
})

</script>

<style lang="scss">
@import "@/assets/css/main.css";
// @import '@/assets/CSS/fonticon/iconfont.css';
@import '@/assets/font/fonts.css';
</style>
