<template>
  <div class="main-music">
    <Nav />
    <Main />
    <Footer />
    <Transition name="pop">
      <ProgressBar v-if="!$route.meta.isLogin" />
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import Nav from '@/components/home-page/Nav.vue';
import Main from '@/components/home-page/Main.vue';
import Footer from '@/components/home-page/Footer.vue';
import ProgressBar from '@/components/progress-bar/ProgressBar.vue';
</script>

<style lang="scss" scoped>
.main-music {
  background-color: $color;
}
</style>