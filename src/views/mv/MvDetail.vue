<template>
    <div class="mv-detail">
        <div class="mv-detail-left"></div>
        <div class="mv-detail-right"></div>
    </div>
</template>
<script lang='ts' setup>
import { watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute()

watch(() => route.query.mvid, (mvid) => {
    if (route.name == 'mvdetail') {
        console.log('mvid', mvid);
    }
}, { immediate: true })
</script>
<style lang='scss' scoped>
.mv-detail {
    background-color: red;
    height: 100px;

    // &-left {

    // }

    // &-right {

    // }
}
</style>