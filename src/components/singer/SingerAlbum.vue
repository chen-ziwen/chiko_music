<template>
    <ul class="singer-album">
        <li class="singer-album-list" v-for="(item, index) in data" :key="index" @click="turnSheet(item.id)">
            <div class="album-img-box">
                <el-image class="album-img" :src="item.picUrl + '?param=250y250'"></el-image>
            </div>
            <span class="singer-name">{{ item.name }}</span>
            <span class="album-time">{{ dayjs(item.publishTime).format('YYYY-MM-DD') }}</span>
        </li>
    </ul>
</template>
<script lang='ts' setup>
import { SingerAlbumType } from '@/models';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
const props = defineProps<{ data: SingerAlbumType[] }>();
const router = useRouter();
const turnSheet = (id: number) => {
    // router.push({ name: 'sheetlist', query: { sheetid: id } })
}
</script>
<style lang='scss' scoped>
.singer-album {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
     
    .singer-album-list {
        display: flex;
        flex-direction: column;
        width: calc(20% - 80px);
        margin: 0 40px;
        cursor: pointer;
        
        .album-img-box {
            position: relative;
            .album-img {
                width: 100%;
                border-radius: 5px;
                box-shadow: 3px 3px 8px gray;
          }
        }
        .singer-name {
          margin-top: 5px;
        }
        .album-time {
         margin: 6px 0 15px 0;
         font-size: 13px;
         color: #7d7d7d;
        }
       }
}
</style>