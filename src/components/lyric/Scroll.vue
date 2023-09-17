<template>
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>
<script lang='ts' setup>
import { watch, onMounted, shallowRef, toRef } from "vue";
import BetterScroll from "@better-scroll/core";

interface BetterScrollProps {
    probeType?: number;
    click?: boolean;
    listenScroll?: boolean;
    data: any;
    pullup?: boolean;
    beforeScroll?: boolean;
    refrehDelay?: number;
    direction?: string;

}
const DIRECTION_H = 'horizontal';
const DIRECTION_V = 'vertical';

const props = withDefaults(defineProps<BetterScrollProps>(), {
    probeType: 1,
    click: false,
    listenScroll: false,
    pullup: false,
    beforeScroll: false,
    refrehDelay: 20,
    direction: "vertical"
});

const data = toRef(props, "data");

const emits = defineEmits(['scroll', 'scrollEnd', 'beforeScrollStart'])

const wrapper = shallowRef<HTMLElement>();
let scroll: BetterScroll;

function initScroll() {
    if (!wrapper.value) return;
    scroll = new BetterScroll(wrapper.value, {
        probeType: props.probeType,
        click: props.click,
        mouseWheel: true,
        eventPassthrough: props.direction === DIRECTION_V ? DIRECTION_H : DIRECTION_V
    });

    if (props.listenScroll) {
        scroll.on('scroll', (val: any) => {
            emits('scroll', val);
        })
    }

    if (props.pullup) {
        scroll.on('scrollEnd', () => {
            if (scroll.y <= (scroll.maxScrollY + 50)) {
                emits('scrollEnd');
            }
        })
    }

    if (props.beforeScroll) {
        scroll.on('beforeScrollStart', () => {
            emits('beforeScrollStart');
        })
    }
}

function disable() {
    scroll && scroll.disable()
};
function enable() {
    scroll && scroll.enable()
};
function refresh() {
    scroll && scroll.refresh()
};
function scrollTo(...args: any) {
    scroll && scroll.scrollTo.apply(scroll, args)
};
function scrollToElement(...args: any) {
    scroll && scroll.scrollToElement.apply(scroll, args)
};


watch(data, () => setTimeout(refresh, props.refrehDelay));

onMounted(() => setTimeout(initScroll, 20));

defineExpose({
    disable,
    enable,
    refresh,
    scrollTo,
    scrollToElement,
})

</script>
<style lang='scss' scoped></style>
 