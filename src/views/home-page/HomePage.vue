<template>
  <div class="main-music">
    <MyNav></MyNav>
    <MyMain></MyMain>
    <MyFooter></MyFooter>
    <ProgressBar></ProgressBar>
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
const { playing } = storeToRefs(usePlay()) // 不可播放歌曲时隐藏
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

.main-music::-webkit-scrollbar {
  width: 0px;
}

.main-music::-webkit-scrollbar-track {
  background: red;
}
</style>