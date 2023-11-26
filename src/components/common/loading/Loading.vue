<template>
    <div class="loading">
        <LoadingIcon class="loading-icon"></LoadingIcon>
    </div>
</template>
<script lang='ts' setup>
import LoadingIcon from './LoadingIcon.vue';
withDefaults(defineProps<Partial<{ maxHeight: number, minHeight: number }>>(), {
    minHeight: 150,
});
</script>
<style lang='scss' scoped>
.loading {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: v-bind("minHeight + 'px'");

    &-icon {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%, -50%, 0);
    }
}
</style>