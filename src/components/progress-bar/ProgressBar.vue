<template>
    <div class="progress-bar" v-if="Object.keys(currentPlay).length > 0">
        <audio ref="audio" autoplay class="audio" :src="currentPlay?.url" @playing="onPlaying" @pause="audioPaused" @error="errorMsg" @ended="ended" @timeupdate="timeupdate" :muted="isMuted"></audio>
        <div class="info">
            <div class="left-box flex-row flex-grow-1">
                <el-image class="picture" :src="currentPlay.image" fit="fill">
                </el-image>
                <div class="song-msg flex-column">
                    <span class="song-name text-hidden">{{ currentPlay.name }}</span>
                    <span class="singer-name text-hidden">{{ changeData(currentPlay.singer) }}</span>
                </div>
            </div>

            <div class="flex-column flex-grow-2 flex-center">
                <div class="play-btn flex-acenter">
                    <i class="iconfont" :class="[pattern.icon, randomStyle]" :title="pattern.name" @click="changeState"></i>
                    <i class="iconfont icon-shangyiji" @click="preSong"></i>
                    <i class="iconfont noshake play" :class="playing" @click="togglePlay"></i>
                    <i class="iconfont icon-xiayiji" @click="nextSong"></i>
                    <i class="iconfont icon-geciweidianji"></i>
                </div>
                <div class="play-bar el-style flex-center flex-row">
                    <span class="start-time">{{ formatSecondTime(currentTime) }}</span>
                    <el-slider v-model="percent" :show-tooltip="false" size="small" @change="drapProgress"></el-slider>
                    <span class="end-time">{{ formatSecondTime(currentPlay.duration) }}</span>
                </div>

            </div>

            <div class="right-box el-style flex-grow-1 flex-jcenter">
                <i class="iconfont audio noshake" :class="muted" @click="changeMuted"></i>
                <el-slider v-model="mutedAll.volume" @change="changeVolume" :show-tooltip="false" size="small"></el-slider>
            </div>
        </div>
    </div>
</template>
<script lang='ts' setup>
import { ref, watch, computed, reactive } from 'vue';
import { usePlay, playState } from '@/store/play';
import { formatSecondTime, randomNum } from '@/util';
import { ElMessage } from 'element-plus';

const play = usePlay();
// 获取pinia中的存储的当前点击歌曲信息
const currentPlay = computed(() => {
    return play.currentPlay;
})

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
// 音乐资源是否能播放
const noPlay = ref<boolean>(false);
let timeout: number;

// 获取当前播放的进度，计算出进度条的百分比
const timeupdate = (e: any) => {
    currentTime.value = e.target.currentTime;
    percent.value = (e.target.currentTime / currentPlay.value.duration) * 100;
}

// 切换播放和暂停图标
const playing = computed(() => play.playing ? "icon-bofang" : "icon-zanting");
// 切换静音和非静音图标
const muted = computed(() => isMuted.value ? "icon-jingyin" : "icon-shengyin");
// 歌曲模式按钮
const pattern = computed(() => {
    switch (play.playType) {
        case 0:
            return {
                icon: 'icon-liebiaoxunhuan',
                name: '列表循环'
            }
        case 1:
            return {
                icon: 'icon-danquxunhuan',
                name: '单曲循环'
            }
        case 2:
            return {
                icon: 'icon-suiji',
                name: '随机播放'
            }
        default:
            return {
                icon: 'liebiaoxunhuan',
                name: '列表循环'
            }
    }
})
// 切换歌曲播放状态
const changeState = () => {
    // 写一下 dispath函数形式的修改方式
    play.$patch((state) => {
        state.playType = (state.playType + 1) % 3;
    });
}

const randomStyle = computed(() => {
    if (play.playType == 2) {
        return 'random'
    }
    return '';
})

// 歌曲能播放的处理
const onPlaying = () => {
    clearInterval(timeout);  // 关闭定时器
    noPlay.value = false;
    play.playing = true; // 触发播放
}
// 歌曲不能播放时候的处理
const errorMsg = () => {
    noPlay.value = true;
    play.playing = false;
    // 不可播放的提示
    ElMessage({
        showClose: true,
        message: '此歌曲为VIP专属歌曲，不可播放，5s后自动播放下一首!!!',
        type: "warning",
        duration: 3500,
    })
    clearInterval(timeout);
    // 如果遇到不能播放的音乐，5秒后播放下一首
    timeout = window.setTimeout(() => {
        nextSong();
    }, 5000)

}

// 将歌手姓名数组处理
const changeData = (msg: any) => {
    if (!msg) {
        return '暂无数据'
    }
    let newData = msg.map((item: any) => item.name)
    return newData.join(' / ')
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

// 上一首歌
const preSong = () => {
    const len = play.playList.length - 1;
    play.currentindex -= 1;
    if (play.currentindex === -1) {
        play.currentindex = len;
    }
    // 当播放状态为false时，让它播放
    if (!play.playing) {
        togglePlay();
    }
}

// 下一首歌
const nextSong = () => {
    const len = play.playList.length;
    play.currentindex += 1;
    if (play.currentindex === len) {
        play.currentindex = 0;
    }
    if (!play.playing) {
        togglePlay();
    }
}
// 单曲循环
const loop = () => {
    if (!audio.value) return;
    audio.value.currentTime = 0; // 时间归0
    audio.value.play(); // 重新开始播放
}

// 歌曲完成时，对当前的音乐状态进行判断
const ended = () => {
    const type = play.playType;
    if (type === playState.loop) {
        loop(); // 单曲循环直接从头开始播
    } else if (type === playState.listloop) {
        nextSong() // 列表循环直接放下一首
    } else if (type === playState.random) {
        // 这个随机播放可能会重复，无所谓了，反正也是自己用
        play.currentindex = randomNum(0, play.playList.length)
    }
}

// 拖动进度条触发
const drapProgress = (val: number) => {
    if (!audio.value) return;
    if (noPlay.value) return;
    audio.value.currentTime = (val / 100) * currentPlay.value.duration;
    percent.value = val;
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

// 监听播放状态，判断是否播放或暂停
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
    opacity: .95;
    z-index: 9999;

    .info {
        display: flex;
        width: 85%;
        margin: 0 auto;

        .play-btn {
            padding: 6px 6px 10px 6px;
            width: 360px;
            box-sizing: border-box;
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
            width: 130px;

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
                    max-width: 260px;

                }

                .singer-name {
                    font-size: 14px;
                    margin-top: 10px;
                }
            }
        }

        .right-box {
            width: 80px;
            align-items: flex-end;
            padding-bottom: 10px;

            .audio {
                margin-right: 10px;
            }
        }

    }

}

.iconfont {
    width: 20%;
    font-size: 24px;
    color: lightcoral;
    cursor: pointer;
    text-align: center;
    transform: translate(0, 0);

    &:not(.noshake) {
        &:active {
            transition: all 0.25s;
            transform: translate(2px, 2px);
        }
    }
}

.random {
    font-size: 20px;
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