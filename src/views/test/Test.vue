<template>
  <div class="music-singer container">
    我是测试页面
    <div class="test">
      <!-- 我感觉非常好 路由配置成功 -->
      <!-- <button @click="songsList">点击获取信息</button> -->
      <!-- <button @click="searchSongs">点击获取歌曲信息</button> -->
      <button @click="recommend">推荐列表</button>
      <!-- <button @click="SearchSuggest">搜索建议</button> -->

      <div class="songbtn">
        <button @click="getMv">获取mv</button>
        <button @click="displaySong">播放歌曲</button>
        <input type="text" v-model="mvName" />
      </div>
      <!-- <div v-for="(a, index) in getS" :key="index">{{ a.songs[index].name }}</div> -->

      <audio ref="audio" @timeupdate="updateTime" v-show="songsUrl" controls autoplay :src="songsUrl" class="audio"></audio>
      <video v-show="videoUrl" :src="videoUrl" width="520" height="400" controls autoplay class="video"></video>
      <ul class="uls">
        <li v-for="(talk, index) in musicTalk.hot" :key="index" :style="{ listStyle: 'none' }">{{ talk.content }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, onMounted, reactive, ref, computed, onUnmounted } from "vue";
import {
  getSearchHotDetail,
  getSearchSong,
  getRecommendList,
  getSearchSuggest,
  getToplistArtist,
  getToplistDetail,
  getTopArtists,
  getArtistMv,
  getMvDetail,
  getSongUrl,
  getMvUrl,
  getPersonalizedMv,
  getBanner,
  getCommentMusic,
  getTopPlaylist
} from "../../api/http/api";

import type { SearchHotDetail, RecommendList } from "../../models/detail";

const getR = ref<SearchHotDetail[]>();
const getS = ref<any>();
const getRecommend = ref<RecommendList[]>();
const mvName = ref<string>("");
const songsUrl = ref<string>("");
const videoUrl = ref<string>("");
const audio = ref<HTMLAudioElement>();
const musicTalk = reactive<{ hot: { content: string }[] }>({
  hot: [{ content: "" }],
});
const currentTime = ref<number>(0)
async function songsList() {
  let { data } = await getSearchHotDetail(); //右边的式子的值等于promise成功状态下reslove(res) 中的res
  let abc = await [data, "我变得好奇怪"];
  console.log(abc);
  let getD = data;
  console.log("歌曲列表", getD);
  getR.value = getD;
}
function songsList2() {
  getSearchHotDetail().then((res) => {
    // console.log('llalalalal', res.data)
    return new Promise((reslove, reject) => {
      console.log("我是需要的数据", res.data);
      reslove([res, "我变得更多了"]);
    })
      .then((res) => {
        console.log("我是更多数据", res);
      })
      .then((res) => {
        console.log("百分百是undfined", res);
      });
  });
}

// (async function getToplist() {
//     let { list } = await getToplistDetail()
//     console.log('获取歌手排行榜', list)
// })()
async function searchSongs() {
  let { result } = await getSearchSong("海阔天空", 10);
  let songs = result;
  getS.value = songs.songs;
  // console.log(songs.songs[0].name)
  console.log("歌曲搜索", songs);
}

async function recommend() {
  let { result } = await getTopArtists(30); //推荐歌单
  let { artists } = await getTopArtists(); //推荐歌手
  let { banners } = await getBanner()// 获取轮播图
  let RMV = await getPersonalizedMv(); //推荐mv
  let a = await getTopPlaylist('hot', '华语')
  let recommend = banners;
  getRecommend.value = recommend;
  // console.log(songs.songs[0].name)
  console.log("轮播图", getRecommend.value);
}

async function SearchSuggest() {
  let a = await getSearchSuggest("不再见");
  console.log(a);
}
async function getMv() {
  let { result } = await getSearchSong(mvName.value, 5);
  let songsMvId = result.songs[0].mv;
  let { data } = await getMvUrl(songsMvId);
  // let b = await getMvDetail(songsMvId)
  videoUrl.value = data.url;
  if (!data.url) {
    alert("暂无该资源");
  }
}
async function displaySong() {
  let { result } = await getSearchSong(mvName.value, 5);
  console.log(result.songs);
  let songsId = result.songs[0].id;
  let srl = await getSongUrl(songsId);
  let { comments, hotComments } = await getCommentMusic(songsId);
  songsUrl.value = srl.data[0].url;
  console.log('歌曲信息', srl.data, result, currentTime.value);

  console.log("你好我i你", songsUrl.value, comments, hotComments);
  musicTalk.hot = hotComments;
  if (!songsUrl.value) {
    alert("暂无该资源");
  }
}

//监听时间的变化
function updateTime(e: any) {
  console.log('time', e.target.currentTime, currentTime.value);
}
onUnmounted(() => {
  console.log('666销毁了');

})
</script>

<style lang="scss" scoped>
.music-singer {
  background-image: linear-gradient(-45deg, lightblue, pink);
  width: 100%;
  height: 800px;
}
</style>