<template>
    <div class="test">
        我感觉非常好 路由配置成功
        <button @click="hh">点击获取信息</button>
        <button @click="song">点击获取歌曲信息</button>
        <div v-for="(a, index) in getR" :key="index">{{ a.searchWord }}</div>
        <!-- <div v-for="(a, index) in getS" :key="index">{{ a.songs[index].name }}</div> -->
    </div>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue';
import { getSearchHotDetail, getSearchSong } from '../api/http/api';
import type { SearchHotDetail } from '../models/detail';
const getR = ref<SearchHotDetail[]>();
const getS = ref<any>();

async function hh() {
    let { data } = await getSearchHotDetail()
    let getD = data
    console.log(getD)
    getR.value = getD
}
async function song() {
    let { result } = await getSearchSong('海阔天空')
    let songs = result;
    getS.value = songs
    // console.log(songs.songs[0].name)
    console.log(songs.songs)
}
</script>

<style scoped>
.test {
    background-color: red;
    width: 500px;
    height: 500px;
    border-radius: 250px;
}
</style>