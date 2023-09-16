<template>
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>
<script lang='ts' setup>
import { watch, onMounted, shallowRef } from "vue";
import BetterScroll from "@better-scroll/core";

interface BetterScrollProps {
    probeType?: number;
    click?: boolean;
    listenScroll?: boolean;
    data: [];
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
    direction: DIRECTION_V
});

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
        scroll.on('scroll', (val) => {
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
function scrollTo() {
    scroll && scroll.scrollTo.apply(scroll, arguments)
};
function scrollToElement() {
    scroll && scroll.scrollToElement.apply(scroll, arguments)
};


watch(props.data, () => setTimeout(refresh, props.refrehDelay));

onMounted(() => setTimeout(initScroll, 20));


</script>
<style lang='scss' scoped></style>
 