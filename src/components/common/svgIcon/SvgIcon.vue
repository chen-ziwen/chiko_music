<template>
    <svg :class="svgStyle" v-bind="$attrs" :style="{ width: width + 'px', height: height + 'px', color }">
        <use :href="svgName"></use>
    </svg>
</template>
<script lang='ts' setup>
import { computed } from 'vue';

interface SvgProps {
    width?: number;
    height?: number;
    color?: string;
    iconName: string;
    className?: string;
}

const props = withDefaults(defineProps<SvgProps>(), {
    width: 16,
    height: 16
});

const svgName = computed(() => {
    return "#icon-" + props.iconName;
})

const svgStyle = computed(() => {
    if (props.iconName) {
        return `svg-icon icon-${props.iconName}`;
    }
    return `svg-icon`;
})

</script>
<style lang='scss' scoped>
// 这个为所有svg通用样式
.svg-icon {
    width: 16px;
    height: 16px;
    vertical-align: -0.15em;
    fill: currentColor; // 这个样式代表fill颜色会和color的颜色一致
    /*此属性为更改svg颜色属性设置*/
    // stroke: currentColor;
    overflow: hidden;
    margin-right: 8px;
}
</style>