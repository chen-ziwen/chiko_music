<template>
  <main class="main-music">
    <MyNav></MyNav>
    <MyMain></MyMain>
    <MyFooter></MyFooter>
  </main>
</template>

<script lang="ts" setup>
// 使用了 unplugin-vue-components插件，插件可以自动引入，import引入就不需要了
// import MyNav from '@/components/my-nav/MyNav.vue';
// import MyMain from '@/components/my-main/MyMain.vue';
// import MyFooter from '@/components/my-footer/MyFooter.vue';
</script>

<style lang="scss" scoped>
.main-music {
  background-color: $color;
}
</style>