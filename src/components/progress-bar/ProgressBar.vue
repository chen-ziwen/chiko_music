<template>
    <div class="progress-bar" v-show="show">
        <audio ref="audio" autoplay class="audio" :src="currentPlay?.url" @playing="onPlaying" @pause="audioPaused" @error="errorMsg" @timeupdate="timeupdate" :muted="isMuted"></audio>
        <div class="info">
            <div class="left-box flex-row flex-grow-1">
                <el-image class="picture" :src="currentPlay.image" fit="fill">
                </el-image>
                <div class="song-msg flex-column">
                    <span class="song-name text-hidden">{{currentPlay.name}}</span>
                    <span class="singer-name text-hidden">{{changeData(currentPlay.singer)}}</span>
                </div>
            </div>

            <div class="flex-column flex-grow-2 flex-center">
                <div class="play-btn flex-center">
                    <i class="iconfont icon-danquxunhuan"></i>
                    <!-- <i class="iconfont icon-liebiaoxunhuan"></i>
                    <i class="iconfont icon-suiji"></i> -->
                    <i class="iconfont icon-shangyiji"></i>
                    <i class="iconfont play" :class="playing" @click="togglePlay"></i>
                    <i class="iconfont icon-xiayiji"></i>
                    <i class="iconfont icon-geciweidianji"></i>
                </div>
                <div class="play-bar el-style flex-center flex-row">
                    <span class="start-time">{{formatSecondTime(currentTime)}}</span>
                    <el-slider v-model="percent" :show-tooltip="false" size="small" @change="drapProgress"></el-slider>
                    <span class="end-time">{{formatSecondTime(currentPlay.duration)}}</span>
                </div>

            </div>

            <div class="right-box el-style flex-grow-1 flex-jcenter">
                <i class="iconfont" :class="muted" @click="changeMuted"></i>
                <el-slider v-model="mutedAll.volume" @change="changeVolume" :show-tooltip="false" size="small"></el-slider>
            </div>
        </div>
    </div>
</template>
<script lang='ts' setup>
import { ref, watch, computed, reactive, nextTick, onUnmounted } from 'vue';
import { usePlay } from '@/store/play';
import { formatSecondTime } from '@/hook';
import { ElMessage, ElNotification } from 'element-plus';

const play = usePlay();
// 获取pinia中的存储的当前点击歌曲信息
const currentPlay = computed(() => {
    return play.currentPlay;
})

const show = ref<boolean>(true);
// audio 元素
const audio = ref<HTMLAudioElement>();
// 当前时间和进度条百分比
const currentTime = ref<number>(0);
const percent = ref<number>(0);
// 是否静音
const isMuted = ref<boolean>(false);
// 音量和进度条百分比
const mutedAll = reactive({
    percent: 0.3,
    volume: 30,
})
// 音乐资源是能播放
const noPlay = ref<boolean>(false);

// 获取当前播放的进度，计算出进度条的百分比
const timeupdate = (e: any) => {
    currentTime.value = e.target.currentTime;
    percent.value = (e.target.currentTime / currentPlay.value.duration) * 100;
}

// 切换播放和暂停图标
const playing = computed(() => play.playing ? "icon-bofang" : "icon-zanting");
// 切换静音和非静音图标
const muted = computed(() => isMuted.value ? "icon-jingyin" : "icon-shengyin");

// 歌曲能播放的处理
const onPlaying = () => {
    noPlay.value = false; // 
    play.playing = true; // 触发播放
}
// 歌曲不能播放时候的处理
const errorMsg = () => {
    noPlay.value = true;
    play.playing = false;
    // 不可播放的提示
    ElNotification({
        showClose: true,
        message: '此歌曲为VIP专属歌曲，不可播放!!!',
        type: "warning",
        duration: 2500,
    })
}
// 将歌手姓名数组处理
const changeData = (msg: any) => {
    if (!msg) {
        return '暂无数据'
    }
    let newData = msg.map((item: any) => item.name)
    return newData.join(' / ')
}

// 上一首歌

const preSong = () =>{

}

// 下一首歌
const nextSong = ()=>{
    
}
// 修改声音大小
const mutedControl = (bol: boolean, num: number) => {
    if (!audio.value) return;
    isMuted.value = bol;
    mutedAll.volume = num;
    audio.value.volume = num / 100;
}
// 静音切换按钮
const changeMuted = () => {
    isMuted.value ? mutedControl(false, 30) : mutedControl(true, 0)
}
// 拖动声音进度条
const changeVolume = (num: number) => {
    if (!audio.value) return;
    if (num === 0) {
        isMuted.value = true;
    } else {
        isMuted.value = false;
    }
    mutedAll.percent = num / 100;
    audio.value.volume = num / 100;
}
// 当暂停的时候，将播放状态设置为false
const audioPaused = () => {
    play.playing = false; //当歌曲播放完成时也会执行
}
// 来回切换播放状态
const togglePlay = () => {
    if (noPlay.value) return;
    play.playing = !play.playing;
}

// 拖动进度条触发
const drapProgress = (val: number) => {
    if (!audio.value) return;
    if (noPlay.value) return;
    audio.value.currentTime = (val / 100) * currentPlay.value.duration;
    percent.value = val;
}
// 当播放按钮为暂停时在播放歌曲，那么这个时候点击播放会导致歌曲重复播放
// 监听播放状态,来切换图标
watch(() => play.playing, (isPlaying) => {
    if (audio.value) {
        isPlaying ? audio.value.play() : audio.value.pause();
    }
}, { flush: "post", immediate: true })


</script>
<style lang='scss' scoped>
.progress-bar {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 80px;
    min-width: $width;
    background-color: whitesmoke;


    .info {
        display: flex;
        width: 85%;
        margin: 0 auto;

        .play-btn {
            padding: 8px;
        }

        .play-bar {
            width: 450px;
            transform: translateY(-8px);

            .start-time,
            .end-time {
                padding: 0px 15px;
            }
        }

        .left-box {
            display: flex;
            max-width: 250px;

            .picture {
                flex-shrink: 0;
                width: 55px;
                height: 55px;
            }

            .song-msg {
                color: #F08080;
                height: 100%;
                padding: 10px 0px 0px 10px;
                box-sizing: border-box;

                .song-name,
                .singer-name {
                    font-size: 18px;
                    max-width: 180px;
                    
                }
                .singer-name{
                    font-size: 14px;
                    margin-top: 10px;
                }
            }
        }

        .right-box {
            width: 80px;
            align-items: flex-end;
            padding-bottom: 10px;
        }

    }

}

.iconfont {
    font-size: 24px;
    color: lightcoral;
    cursor: pointer;
    margin: 0px 16px;
}

.play {
    font-size: 40px;

}

.el-style {
    :deep(.el-slider__bar) {
        background-color: #F08080 !important;
    }

    :deep(.el-slider__button) {
        border: 2px solid #F08080 !important;
        width: 17px;
        height: 17px;
    }
}
</style>