<template>
  <div class="main-music">
    <Nav></Nav>
    <Main></Main>
    <Footer></Footer>
    <Transition name="pop">
      <ProgressBar v-if="!$route.meta.isLogin"></ProgressBar>
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