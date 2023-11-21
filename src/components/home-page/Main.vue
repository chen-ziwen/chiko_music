<template>
  <main class="music-main container">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
      </keep-alive>
      <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
    </router-view>
  </main>
</template>

<script lang="ts" setup>

</script>
<style lang="scss" scoped>
.music-main {
  background-color: $color;
  // 上下的盒子宽高各是80px，所以中间盒子的最小宽度设置为100vh - 160px 就能做到完美适应
  min-height: calc(100vh - 160px);

}

.chat {
  position: fixed;
  left: 50px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 300px;
  background-color: pink;

  &:hover {
    background-color: lightblue;
    transition: all 1.5s ease-in-out;
  }

  span {
    display: block;
    width: 10px;
    word-wrap: break-word;
  }
}
</style>
