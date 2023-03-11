<template>
    <div class="content-box">
        <div class="content-head">
            <span class="m-title">{{ props.title }}</span>
        </div>
        <slot></slot>
    </div>
</template>
<script lang='ts' setup>
import { computed } from 'vue';
interface Recommend {
    title?: string;
    back?: string;
    fontSize?: number;
    fontWeight?: number;
    color?: string;
    gap?: number;
}
const props = withDefaults(defineProps<Recommend>(), {
    title: "我是标题哦",
    back: "trasnparent",
    fontSize: 26,
    fontWeight: 700,
    color: '#000000',
    gap: 10,
});

const fontSize = computed(() => props.fontSize + 'px');
const gap = computed(() => props.gap + 'px');
</script>
<style lang='scss' scoped>
.content-box {
    width: 100%;
    background-color: v-bind(back);
    border-radius: 10px;
    padding: 0px 10px 20px 10px;
    box-sizing: border-box;
    color: v-bind('props.color');

    .content-head {
        .m-title {
            display: inline-block;
            text-align: start;
            margin: 25px 0px 10px v-bind(gap);
            font-size: v-bind(fontSize);
            font-weight: v-bind('props.fontWeight');
            font-family: Arial, Helvetica, sans-serif;
        }
    }
}
</style>