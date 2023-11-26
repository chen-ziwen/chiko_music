<template>
    <div class="progress-bar" v-show="currentPlay?.id">
        <audio ref="audio" class="audio" :src="currentPlay?.url" @playing="audioReady" @pause="audioPaused"
            @error="audioError" @ended="audioEnded" @timeupdate="timeupdate" :muted="isMuted"></audio>
        <div class="info">
            <div class="left-box flex-row flex-grow-1">
                <el-image class="picture" :src="currentPlay.image" fit="fill">
                </el-image>
                <div class="song-msg flex-column">
                    <span class="song-name text-hidden">{{ currentPlay.name }}</span>
                    <span class="singer-name text-hidden">{{ currentPlay.singer }}</span>
                </div>
            </div>
            <div class="flex-column flex-grow-2 flex-center">
                <div class="play-btn flex-acenter">
                    <i class="iconfont" :class="[pattern.icon, randomStyle]" :title="pattern.name" @click="changeState"></i>
                    <i class="iconfont icon-shangyiji" @click="preSong"></i>
                    <i class="iconfont noshake play" :class="playing" @click="togglePlay"></i>
                    <i class="iconfont icon-xiayiji" @click="nextSong"></i>
                    <i class="iconfont icon-geciweidianji" @click="openLyric"></i>
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
        <transition name="slide-fade">
            <div class="player-page" v-if="showLyric">
                <div class="container">
                    <div class="page-left">
                        <div class="cover-image" :class="play.playing ? 'playing' : ''">
                            <img :src="currentPlay.image" />
                        </div>
                    </div>
                    <div class="page-right">
                        <h3 class="name flex-between">
                            {{ currentPlay.name }}
                            <i @click="openLyric" class="iconfont"></i>
                        </h3>
                        <p>{{ currentPlay.singer }} - {{ currentPlay.album }}</p>
                        <div class="lyric-wrap">
                            <CLyric ref="lyricRef" :currentLyric="currentLyric" :currentLyricNum="currentLyricNum"></CLyric>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script lang='ts' setup>
import { ref, shallowRef, watch, computed, nextTick, reactive, onMounted } from 'vue';
import { usePlay, playState } from '@/store/play';
import { formatSecondTime, randomNum } from '@/util';
import { getLyric } from '@/api';
import Lyric from "lyric-parser";
import CLyric from "@/components/lyric/Lyric.vue";

const play = usePlay();
const currentPlay = computed(() => play.currentPlay);
const lyricRef = ref<InstanceType<typeof CLyric> | null>(null);
const currentLyric = ref<any>(null);
const currentLyricNum = ref<number>(0);
const isPureMusic = ref<boolean>(false);
const playingLyric = ref<string>('');
const audio = shallowRef<HTMLAudioElement>();
const currentTime = ref<number>(0);
const percent = ref<number>(0);
const isMuted = ref<boolean>(false);
const mutedAll = reactive({
    percent: 0.3,
    volume: 30,
});
const songReady = ref<boolean>(false);
const showLyric = ref<boolean>(false);
let timeout: number;

// 获取当前播放的进度，计算出进度条的百分比
const timeupdate = (e: any) => {
    currentTime.value = e.target.currentTime;
    percent.value = Math.ceil(e.target.currentTime / currentPlay.value.duration * 100);
}

// 切换播放和暂停图标
const playing = computed(() => play.playing ? "icon-bofang" : "icon-zanting");
// 切换静音和非静音图标
const muted = computed(() => isMuted.value ? "icon-jingyin" : "icon-shengyin");
// 歌曲模式按钮
const pattern = computed(() => {
    switch (play.playType) {
        case 0:
        default:
            return { icon: 'icon-liebiaoxunhuan', name: '列表循环' };
        case 1:
            return { icon: 'icon-danquxunhuan', name: '单曲循环' };
        case 2:
            return { icon: 'icon-suiji', name: '随机播放' };
    }
})
// 切换歌曲播放状态
const changeState = () => {
    play.$patch((state) => {
        state.playType = (state.playType + 1) % 3;
    });
}

const randomStyle = computed(() => {
    if (play.playType == 2) {
        return 'random';
    }
    return '';
})

// 歌曲能播放的处理
const audioReady = () => {
    timeout && clearTimeout(timeout);
    songReady.value = true;
    if (currentLyric.value && !isPureMusic.value) {
        currentLyric.value.seek(currentTime.value * 1000);
    }
}
// 歌曲不能播放时候的处理
const audioError = () => {
    timeout && clearTimeout(timeout);
    songReady.value = true;
}

// 当暂停的时候，将播放状态设置为false
const audioPaused = () => {
    play.playing = false;
    if (currentLyric.value) {
        currentLyric.value.stop();
    }
}

// 上一首歌
const preSong = () => {
    const len = play.playList.length - 1;
    play.currentindex -= 1;
    if (play.currentindex === -1) {
        play.currentindex = len;
    }
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
    play.playing = true;
    if (currentLyric.value) {
        currentLyric.value.seek(0);
    }
}

// 歌曲完成时，对当前的音乐状态进行判断
const audioEnded = () => {
    const type = play.playType;
    if (type === playState.loop) {
        loop(); // 单曲循环直接从头开始播
    } else if (type === playState.listloop) {
        nextSong(); // 列表循环直接放下一首
    } else if (type === playState.random) {
        play.currentindex = randomNum(0, play.playList.length);
        play.playing = true;
    }
}

// 来回切换播放状态
const togglePlay = () => {
    if (!songReady.value) return;
    play.playing = !play.playing;
    if (currentLyric.value) {
        currentLyric.value.togglePlay();
    }
}

// 拖动进度条触发
const drapProgress = (val: number) => {
    if (!audio.value) return;
    const currentTime = (val / 100) * currentPlay.value.duration;
    audio.value.currentTime = currentTime;
    percent.value = val;
    if (currentLyric.value) {
        currentLyric.value.seek(currentTime * 1000);
    }
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
// 初始化音量
onMounted(() => {
    audio.value && changeVolume(mutedAll.volume);
});

function openLyric() {
    showLyric.value = !showLyric.value;
}

async function getLyricInfo(id: number) {
    try {
        let res = await getLyric(id);
        if (res.code === 200) {
            const lyric = res.lrc.lyric;
            currentLyric.value = new Lyric(lyric, lyricHandle);
            if (isPureMusic.value) {
                playingLyric.value = currentLyric.value.lrc.replace(
                    /\[(\d{2}):(\d{2}):(\d{2})\]/g,
                    ''
                )
            } else {
                if (play.playing) {
                    currentLyric.value.seek(currentTime.value * 1000);
                }
            }
        }
    } catch (e) {
        currentLyric.value = null;
        playingLyric.value = '';
        currentLyricNum.value = 0;
    }
}

function lyricHandle({ lineNum, txt }: { lineNum: number, txt: string }) {
    if (!lyricRef.value) return;
    currentLyricNum.value = lineNum;
    playingLyric.value = txt;
    if (lineNum > 10) {
        const lineEl = lyricRef.value?.lyricLine[lineNum - 10];
        if (lyricRef.value.lyricList) {
            nextTick(() => {
                lyricRef.value?.lyricList!.scrollToElement(lineEl, 1000);
            })
        }
    } else {
        if (lyricRef.value.lyricList) {
            nextTick(() => {
                lyricRef.value?.lyricList?.scrollTo(0, 0, 1000);
            })
        }
    }
}

// 监听播放的歌曲是否变化 用于外面的播放项
watch(() => currentPlay.value.id, () => {
    if (!currentPlay.value.id || !currentPlay.value.url) return;
    songReady.value = false; // 当前歌曲能播放时 再去切换为true
    // play.playing = true; // 每次切换歌曲 都会变为播放状态
    if (currentLyric.value) {
        currentLyric.value.stop();
        currentLyric.value = null;
        currentTime.value = 0;
        playingLyric.value = '';
        currentLyricNum.value = 0;
    };
    nextTick(() => {
        if (!audio.value) return;
        audio.value.src = currentPlay.value?.url;
        audio.value.volume = mutedAll.volume / 100;
        audio.value.play();
    });
    clearTimeout(timeout);
    timeout = window.setTimeout(() => {
        songReady.value = true;
    }, 5000);
    getLyricInfo(currentPlay.value.id);
});

// 监听播放状态 用于自我切换
watch(() => play.playing, (isPlaying) => {
    if (!songReady.value || !audio.value) return;
    isPlaying ? audio.value.play() : audio.value.pause();
});

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
    z-index: 999;

    .player-page {
        width: 100%;
        height: 100vh;
        z-index: 9998;
        background: rgba(255, 255, 255, 1);
        position: fixed;
        top: 0;
        left: 0;
        padding-top: 150px;

        .container {
            display: flex;

            .page-left,
            .page-right {
                width: 50%;
            }

            .cover-image {
                width: 400px;
                height: 400px;
                position: relative;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 5px;
                    position: relative;
                    z-index: 2;
                    opacity: 1;
                    overflow: hidden;
                    border-radius: 5px;
                    box-shadow: 5px 0 10px -5px #141414;
                }

                &::after {
                    content: '';
                    position: absolute;
                    left: 20%;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1;
                    transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.8s 0.5s;
                    background: transparent url('@/assets/image/cd-wrap.png') center no-repeat;
                    background-size: contain;
                }

                &.playing {
                    &::after {
                        -webkit-animation: rotate 2s linear infinite;
                        -moz-animation: rotate 2s linear infinite;
                        -ms-animation: rotate 2s linear infinite;
                        -o-animation: rotate 2s linear infinite;
                        animation: rotate 2s linear infinite;
                    }
                }
            }

            .page-right {
                .name {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 10px;

                    .iconfont {
                        font-size: 35px;
                        color: #888;
                        cursor: pointer;
                        transform: rotate(90deg);
                    }
                }

                .lyric-wrap {
                    width: 100%;
                    height: 480px;
                    border-radius: 4px;
                    padding: 30px;
                    overflow: hidden;
                    background: #f8f9ff;
                    margin-top: 30px;
                }
            }
        }
    }

    .info {
        position: relative;
        z-index: 9999;
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

.slide-fade-enter-active {
    transition: all 0.5s ease;
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(0.5, 0.3, 0.2, 0.5);
}

.slide-fade-enter,
.slide-fade-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
</style>