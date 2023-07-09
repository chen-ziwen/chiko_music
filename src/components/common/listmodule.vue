<template>
    <div class="list-module" :class="[boxStyle, outStyle]">
        <span class="list-head" :class="[headStyle]" @click="triggerFun">{{ head }}</span>
        <div class="list-content">
            <slot></slot>
        </div>
    </div>
</template>
<script lang='ts' setup>
import { computed } from 'vue';
interface ListModule {
    head: string;
    boxStyle?: string;
    headStyle?: string;
    outStyle?: string;
    headColor?: string;
    gapColor?: string;
    gapHeight?: string;
}
const props = withDefaults(defineProps<ListModule>(), {
    headColor: 'rgba(74,74,74)',
    gapColor: 'rgba(254,236,239)',
    gapHeight: "22px"
});
const emits = defineEmits(['turn']);

// 生成类名,可以在外部添加样式
const outStyle = computed(() => {
    if (props.outStyle) {
        return props.outStyle;
    } else {
        return;
    }
})

function triggerFun() {
    emits('turn')
}
</script>
<style lang='scss' scoped>
.list-module {
    width: 100%;
    border-radius: 15px;
    padding: 15px;
    box-sizing: border-box;
    background-color: white;

    .list-head {
        display: inline-block;
        color: v-bind('props.headColor');

        &::before {
            content: '';
            display: inline-block;
            width: 2.5px;
            height: v-bind(gapHeight);
            background: v-bind('props.gapColor');
            vertical-align: text-top;
            margin-right: 10px;
        }
    }

    .list-content {
        margin-top: 10px;
    }
}

.dashed {
    border: 1px dashed black !important;
}

.wdashed {
    border: 2px dashed black !important;
}

.head-point {
    cursor: pointer;
    font-weight: 600;

    &:hover {
        color: rgb(255, 117, 117);
    }
}
</style>