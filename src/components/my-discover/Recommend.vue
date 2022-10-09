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
    title?: string;
    back?: string;
}
const props = withDefaults(defineProps<Recommend>(), {
    title: "我是标题哦",
    back: "trasnparent"
})

</script>
<style lang='scss' scoped>
.recommend {
 background-color: $color;
 width: $width;
//  margin-bottom: 20px;
 background-color: v-bind(back);
 border-radius: 10px;
 padding: 0px 10px;
 box-sizing: border-box;
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