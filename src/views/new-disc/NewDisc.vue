<template>
    <div class="container">2222 {{ play.name }}{{ play.age }}</div>
</template>

<script lang="ts" setup>
import { usePlay } from '@/store/play';
const play = usePlay();
play.$patch({
    name: '陈孜孜',
    age: 25,
})
play.age--;
play.$patch(state => {
    state.name = '我不喜欢你';
    state.age = state.age++;
})
play.cName('吉克隽逸')
</script>

<style lang="scss" scoped>
</style>