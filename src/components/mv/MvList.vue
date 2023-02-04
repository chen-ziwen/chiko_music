<template>
    <ul class="mv-list">
        <li class="mv-list-li" v-for="item, index in list" :key="item.id + index">
            <div class="mv-content">
                <el-image class="mv-pic" :src="item.imgurl"></el-image>
            </div>
            <span class="mv-info">
                {{ item.artistName }} {{ item.name }}
            </span>
        </li>
    </ul>
</template>
<script lang='ts' setup>
import type { ArtMV } from '@/models';
const props = defineProps<{ list: ArtMV[] }>();
</script>
<style lang='scss' scoped>
.mv-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 30px;

    .mv-list-li {
        width: 33.3%;
        text-align: center;

        .mv-content {
            width: 100%;

            .mv-pic {
                width: 300px;
                height: 170px;
            }
        }

        // .mv-info {}
    }
}
</style>