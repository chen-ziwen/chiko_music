<template>
    <div class="content-box">
        <div class="content-head">
            <span class="m-title">{{ props.title }}</span>
        </div>
        <slot></slot>
    </div>
</template>
<script lang='ts' setup>
interface Recommend {
    title?: string;
    back?: string;
}
const props = withDefaults(defineProps<Recommend>(), {
    title: "我是标题哦",
    back: "trasnparent"
})

</script>
<style lang='scss' scoped>
.content-box {
    width: $width;
    background-color: v-bind(back);
    border-radius: 15px;
    padding: 0px 10px 20px 10px;
    box-sizing: border-box;

    .content-head {
        .m-title {
            display: inline-block;
            text-align: start;
            margin: 25px 0px 10px 15px;
            font-size: 26px;
            font-weight: 700;
            font-family: Arial, Helvetica, sans-serif;
        }
    }
}
</style>