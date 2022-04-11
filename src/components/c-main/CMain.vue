<template>
  <!-- <router-link :to="{ name: 'login' }">登陆界面</router-link> -->
  <article class="music-main container">
    <Router-view></Router-view>
    <!-- <div class="chat"><span>QQ/2452559902</span></div> -->
  </article>
</template>

<script lang="ts" setup>

</script>
<style lang="scss" scoped>

.music-main {
    background-color: pink;
    min-height: 1000px;
}
// .chat {
//     position: fixed;
//     left: 50px;
//     top: 50%;
//     transform: translateY(-50%);
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     width: 24px;
//     height: 300px;
//     background-color: pink;
//     &:hover {
//         background-color: lightblue;
//         transition: all 1.5s ease-in-out;
//     }
//     span {
//         display: block;
//         width: 10px;
//         word-wrap: break-word;
//     }
// }
</style>
