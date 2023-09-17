<template>
    <ul>
        <li v-for="(data, index) in newSheet" :key="index" class="recommend-new-show-li" @click="turnSheet(index, data.id)">
            <div class="newsong">
                <div class="new-img-box">
                    <el-image class="new-img" :src="data.image + '?param=200y200'" fit="cover">
                        <template #placeholder>
                            <div class="image-slot">
                                <el-icon>
                                    <icon-picture />
                                </el-icon>
                            </div>
                        </template>
                    </el-image>
                    <span class="bofang-btn">
                        <i class="bofang iconfont" :class="playing(index, data.id)"></i>
                    </span>
                </div>
                <div class="newsong-text">
                    <span>{{ data.name }}</span>
                    <span>{{ data.singer }}</span>
                </div>
                <div class="newsong-text-time">
                    <span>{{ formatSecondTime(data.duration) }}</span>
                </div>
            </div>
        </li>
    </ul>
</template>
<script lang='ts' setup>
import { formatSecondTime } from '@/util';
import type { SongList } from '@/models/detail';
import { usePlay } from '@/store/play';
import { Picture as IconPicture } from '@element-plus/icons-vue'

interface NewSongSheet {
    newSheet: SongList[];
}
const props = defineProps<NewSongSheet>();
const play = usePlay();

// 选择歌曲
const turnSheet = (index: number, id: number) => {
    // 当点击的歌曲为当前播放的歌曲，则来回切换播放状态，否则将状态调整为true
    if (index == play.currentindex && id == play.currentPlay.id) {
        play.playing = !play.playing;
    } else {
        play.playing = true;
    }
    // 存储最新的歌曲列表和当前播放索引
    play.$patch({
        currentindex: index,
        playList: props.newSheet,
    })
}

const playing = (index: number, id: number) => {
    if (index === play.currentindex && play.playing && id == play.currentPlay.id) {
        return "icon-zanting1"
    }
    return "icon-bofang1"
}

</script>
<style lang='scss' scoped>
ul {
    li {
        width: 33.3%;
        display: inline-block;
        padding: 10px 15px;
        box-sizing: border-box;

        span {
            display: inline-block;

            font: {
                size: 16px;
                weight: 700;
                family: Arial, Helvetica, sans-serif;
            }
        }

        .newsong {
            display: flex;
            cursor: pointer;

            .new-img-box {
                position: relative;

                .new-img {
                    width: 100px;
                    height: 100px;
                    border-radius: 10px;
                    box-shadow: 4px 4px 6px grey;
                    z-index: 9;
                    overflow: visible;
                }

                .bofang-btn {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    right: 50%;
                    bottom: 50%;
                    transform: translate(50%, 50%);
                    border-radius: 50%;
                    background-color: rgba(239, 237, 237, 0.8);
                    z-index: 10;

                    .bofang {
                        color: rgb(249, 43, 43, 0.8);
                        font-size: 20px;
                        transform: translateX(1px);
                    }
                }
            }

            .newsong-text {
                flex-grow: 1;
                flex-direction: column;
                @include _flex(center, flex-start);
                flex-wrap: wrap;
                margin-left: 25px;
                white-space: pre-wrap; //允许换行

                span {
                    &:nth-child(1) {
                        padding-bottom: 20px;
                    }

                    &:nth-child(2) {
                        padding-bottom: 5px;
                        font-size: 16px;
                        font-weight: 400;
                        color: rgb(238, 109, 109);
                    }
                }

                &-time {
                    margin: auto 0;
                    color: rgb(125, 162, 197);
                }
            }
        }
    }
}

.image-slot {
    @include _imgslot(100px, 100px, 16px);
}
</style>