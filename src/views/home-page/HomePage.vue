<template>
  <div class="main-music">
    <MyNav></MyNav>
    <MyMain></MyMain>
    <MyFooter></MyFooter>
    <Transition name="pop">
      <ProgressBar v-if="barShow"></ProgressBar>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
// 使用了 unplugin-vue-components插件，插件可以自动引入，import引入就不需要了
import MyNav from '@/components/my-nav/MyNav.vue';
import MyMain from '@/components/my-main/MyMain.vue';
import MyFooter from '@/components/my-footer/MyFooter.vue';
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

// ::-webkit-scrollbar 滚动条整体部分，可以设置宽度啥的

// ::-webkit-scrollbar-button 滚动条两端的按钮

// ::-webkit-scrollbar-track 外层轨道

// ::-webkit-scrollbar-track-piece 内层轨道，滚动条中间部分(除去)

// ::-webkit-scrollbar-thumb 滚动条里面可以拖动的那个

// ::-webkit-scrollbar-corner 边角

// ::-webkit-resizer 定义右下角拖动块的样式

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