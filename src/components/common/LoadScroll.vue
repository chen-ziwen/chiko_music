<template>
    <div class="load-scroll">
        <slot></slot>
    </div>
</template>
<script lang='ts' setup>
import { onMounted } from 'vue';
import { Throttle } from '@/util';
interface LoadScrollProps {
    distance?: number; // 距离底部多少px时触发函数
}
const props = withDefaults(defineProps<LoadScrollProps>(), {
    distance: 0
});

const emits = defineEmits(['load-scorll']);

const getScrollTop = () => {
    const scroll = document.documentElement || document.body;
    return scroll?.scrollTop || 0;
};

const getClientHeight = () => {
    let clientHeight = 0;
    const client = document.body.clientHeight && document.documentElement.clientHeight;
    if (client) {
        clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
    } else {
        clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
    }
    return clientHeight;
};

const getScrollHeight = () => {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
};

const triggerFun = () => {
    if (getClientHeight() + getScrollTop() + props.distance >= getScrollHeight()) {
        emits('load-scorll');
    }
}
const throttle = new Throttle().use(triggerFun, 1200, true); // 使用节流函数 防止连续触发

onMounted(() => {
    window.addEventListener('scroll', () => throttle());
})
</script>
<style lang='scss' scoped></style>