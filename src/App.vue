<script setup lang="ts">
</script>

<template>
  <!-- activate：是在被包裹组建被激活的状态下使用的生命周期钩子
  deactivated：在被包裹组件停止使用时调用-->
  <!-- <keep-alive>
    <router-view></router-view>
  </keep-alive>-->
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" v-if="$route.meta.keepAlive" />
    </keep-alive>
    <component :is="Component" v-if="!$route.meta.keepAlive" />
  </router-view>
</template>



<style lang="scss">
@import "@/assets/css/mian.css";
@import "@/assets/css/router.css";
</style>
