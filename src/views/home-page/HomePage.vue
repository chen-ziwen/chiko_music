<template>
  <div class="main-music">
    <Nav></Nav>
    <Main></Main>
    <Footer></Footer>
    <Transition name="pop">
      <ProgressBar v-show="barShow"></ProgressBar>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import Nav from '@/components/home-page/Nav.vue';
import Main from '@/components/home-page/Main.vue';
import Footer from '@/components/home-page/Footer.vue';
import ProgressBar from '@/components/progress-bar/ProgressBar.vue';
import { storeToRefs } from 'pinia';
import { usePlay } from '@/store/play';
import { watch } from 'vue';
const { currentindex, barShow } = storeToRefs(usePlay()) // 不可播放歌曲时隐藏

// 监听歌曲数据是否为空，为空的话，不显示音乐组件
watch(() => currentindex.value, (num: number) => {
  if (num >= 0) {
    barShow.value = true;
  } else {
    barShow.value = false;
  }
}, { immediate: true })

</script>

<style lang="scss" scoped>
.main-music {
  background-color: $color;
}

//出现时弹出
.pop-enter-active,
.pop-leave-active {
  transition: all 0.5s ease-in-out;
}

.pop-enter-from,
.pop-leave-to {
  transform: translateY(80px);
}
</style>