<template>
    <div class="list-module" :class="[boxStyle, outStyle]">
        <span class="list-head">{{ head }}</span>
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
    outStyle?: string;
    headColor?: string;
    gapColor?: string;
}
const props = withDefaults(defineProps<ListModule>(), {
    headColor: 'rgba(74,74,74)',
    gapColor: 'rgba(254,236,239)',
});

// 生成类名,可以在外部添加样式
const outStyle = computed(() => {
    if (props.outStyle) {
        return props.outStyle;
    } else {
        return;
    }
})

</script>
<style lang='scss' scoped>
.list-module {
    width: calc(100% - 35px);
    border-radius: 15px;
    box-shadow: 0px 5px 40px -1px rgb(2 10 18 / 10%);
    padding: 15px;
    background-color: white;

    .list-head {
        display: inline-block;
        color: v-bind('props.headColor');

        &::before {
            content: '';
            display: inline-block;
            width: 2.5px;
            height: 22px;
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
</style>