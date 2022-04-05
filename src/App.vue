<script setup lang="ts">
</script>

<template>
  <router-link to="/login" active-class="router-style">切换到其他</router-link>
  <br />

  <router-link to="/test" active-class="router-style">搜索歌曲</router-link>

  <!-- activate：是在被包裹组建被激活的状态下使用的生命周期钩子
  deactivated：在被包裹组件停止使用时调用-->
  <!-- <keep-alive>
    <router-view></router-view>
  </keep-alive>-->

  <router-view v-slot="{ Component }">
    <!-- <transition> -->
    <keep-alive>
      <component :is="Component" v-if="$route.meta.keepAlive" />
    </keep-alive>
    <component :is="Component" v-if="!$route.meta.keepAlive" />
  </router-view>

  <!-- <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Card name</span>
        <el-button class="button" type="text">Operation button</el-button>
      </div>
    </template>
    <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>
  </el-card>-->
</template>



<style>
@import "./assets/css/router.css";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}
</style>
