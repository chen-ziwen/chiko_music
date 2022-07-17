<template>
    <div>1111 {{ play.name }}{{ play.age }}</div>
</template>

<script lang="ts" setup>
import { usePlay } from '@/store/play';
const play = usePlay();
</script>

<style lang="scss" scoped>
</style>