<!-- 这个组件用于音乐播放时的播放组件 -->
<template>
    <Transition name="slide"></Transition>
    <div class="play-music">

    </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.slide-enter-active {
    transition: all 0.5s ease;
}

.slide-leave-active {
    transition: all 0.3s cubic-bezier(0.5, 0.3, 0.2, 0.5);
}

.slide-enter,
.slide-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
</style>