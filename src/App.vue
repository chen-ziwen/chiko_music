<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { loginStatus } from '@/api';
import { usePlay } from './store/play';
import router from './router';
import { useStorage } from '@/hook';

const play = usePlay();
const storage = new useStorage();
router.beforeEach((to, from, next) => {
  document.title = <string>to.meta.title;
  next();
})

// 项目加载时触发
onMounted(async () => {
  const { data } = await loginStatus();
  console.log(data);

  if (data.account.status >= 0) {
    play.$patch({
      loginStatu: true,
    });
  } else {
    play.$patch({
      loginStatu: false,
    });
  }
  storage.set('loginStatu', play.loginStatu);
})

onUnmounted(() => {
  play.loginStatu = false;
})

</script>

<style lang="scss">
@import "@/assets/css/main.css";
@import "@/assets/css/router.css";
// @import '@/assets/CSS/fonticon/iconfont.css';
@import '@/assets/CSS/fonts.css';
</style>
