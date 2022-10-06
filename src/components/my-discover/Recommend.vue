<template>
    <div class="recommend">
        <div class="recomend-head">
            <span class="m-title">{{props.title}}</span>
        </div>
        <slot></slot>
    </div>
</template>
<script lang='ts' setup>
interface Recommend {
    title?: string
}
const props = withDefaults(defineProps<Recommend>(), {
    title: "我是标题哦"
})

</script>
<style lang='scss' scoped>
.recommend {
 background-color: $color;
 width: $width;
 margin: 0 -15px;
 .recomend-head {
.m-title {
    display: inline-block;
    text-align: start;
   margin: $margin_I;
   font-size: 26px;
   font-weight: 700;
   font-family: Arial, Helvetica, sans-serif;
}
 }
}
</style>