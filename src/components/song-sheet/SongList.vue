<template>
    <div class="sheet">
        <table>
            <thead>
                <tr>
                    <th><span>序号</span></th>
                    <th><span>歌曲</span></th>
                    <th><span>歌手</span></th>
                    <th><span>专辑</span></th>
                    <th><span>时长</span></th>
                </tr>
                <tr class="sheet-list" v-for="item in props.sheetList" :key="item.index" :class="checked(item.index, item.id)" @click="playSong(item.index, item.id)">
                    <td>
                        <span class="sheet-index">{{ (item.index + 1 + '').padStart(2, '0') }}</span>
                        <i class="iconfont icon-show" :class="playing(item.index, item.id)"></i>
                    </td>
                    <td>
                        <img :src="imgurl(item.image, '35')">
                        <span>{{ item.name }}</span>
                    </td>
                    <td>{{ changeData(item.singer) }}</td>
                    <td>{{ item.album }}</td>
                    <td>{{ formatSecondTime(item.duration) }}</td>
                </tr>
            </thead>
        </table>
    </div>
</template>

<script lang='ts' setup>
import { formatSecondTime, imgurl } from '@/hook';
import type { SongList } from "@/models/detail"
import { usePlay } from '@/store/play';

interface sheetProps {
    sheetList: SongList[];
}
const props = defineProps<sheetProps>();
const emits = defineEmits(['keeplist']);
const play = usePlay();


function changeData(msg: any) {
    if (!msg) {
        return '暂无数据'
    }
    let newData = msg.map((item: any) => item.name)
    return newData.join(' / ')
}

const playing = (index: number, id: number) => {
    if (index === play.currentindex && play.playing && id == play.currentPlay.id) {
        return "icon-bofang"
    }
    return "icon-zanting"
};

const checked = (index: number, id: number) => {
    if (index === play.currentindex && play.playing && id === play.currentPlay.id) {
        return 'checked'
    }
    return;
}

// 将当前索引值传递到父组件,当索引值相同时则反复切换
const playSong = (index: number, id: number) => {
    if (index === play.currentindex && id == play.currentPlay.id) {
        play.playing = !play.playing;
    }
    emits("keeplist", index)
}


</script>

<style lang='scss' scoped>
.sheet {
    box-sizing: border-box;
    width: 100%;
    margin-top: 20px;

    table {
        display: block;
        width: 100%;
        height: 100%;
        border-collapse: collapse;

        thead {
            display: block;
            width: 100%;

            // 移入时隐藏数字，显示图标
            .sheet-list {
                &:hover .sheet-index {
                    display: none;
                }

                &:hover .icon-show {
                    display: inline-block;
                }
            }

            tr {
                display: flex;
                width: 100%;
                height: 50px;
                font-weight: 700;
                align-items: center;
                box-sizing: border-box;

                >th {
                    color: rgb(150, 150, 150);
                    font-weight: 300;
                    height: 50px;
                    line-height: 40px;
                    padding: 0px 10px;

                    span {
                        display: inline-block;
                        line-height: 50px;
                    }

                }

                >td {
                    font-weight: 300;
                    padding: 0px 10px;
                }

                >th,
                >td {
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;


                    &:first-child {
                        width: 8%;
                        text-align: center;

                        .icon-show {
                            display: none;
                            font-size: 20px;
                            color: #ef4b4b;
                        }

                    }

                    &:nth-child(2) {
                        display: flex;
                        align-items: center;
                        text-align: start;
                        width: 35%;

                        img {
                            width: 35px;
                            height: 35px;
                            vertical-align: middle;
                            margin-right: 10px;
                            border-radius: 5px;
                        }

                        span {
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden
                        }

                    }

                    &:nth-child(3) {
                        text-align: start;
                        width: 25%;
                    }

                    &:nth-child(4) {
                        text-align: start;
                        width: 22%;
                    }

                    &:nth-child(5) {
                        width: 10%;
                        text-align: center;
                    }
                }

                &:not(:first-child) {
                    cursor: pointer;
                    transition: all .25s linear;

                    &:hover {
                        background-color: rgb(227, 227, 227);
                    }
                }

                &:not(:nth-child(2n-1)) {
                    background-color: #fcfcfc;
                    height: 50px;
                }

                &:not(:nth-child(2n)) {
                    height: 50px;
                    background-color: $color;

                    >span {
                        display: inline-block;
                        overflow: hidden;
                    }
                }
            }


        }
    }

}

.checked {
    >td {
        color: red;
    }
}
</style>