<template>
    <ul class="mv-list">
        <li class="mv-list-li" v-for="item in list" :key="item.id + item.info" @click="sendId(item.id)">
            <div class="mv-content">
                <div class="mv-message">
                    <el-image class="mv-pic" :src="item.imgurl" fit="cover"/>
                    <div class="mv-tips">
                        <span class="aritst-name"> {{ item.artistName }}</span>
                        <span class="mv-time">{{ item.duration }}</span>
                    </div>
                    <div class="play-count">
                        <i class="iconfont icon-bofang1"></i>
                        <span class="count-num">{{ item.playCount }}</span>
                    </div>
                    <span class="bofang-btn">
                        <i class="bofang iconfont icon-bofang1"></i>
                    </span>
                </div>
                <span class="mv-info">{{ item.info }}</span>
            </div>
        </li>
    </ul>
</template>
<script lang='ts' setup>
import type { MvType } from '@/util';
const props = defineProps<{ list: MvType[] }>();
const emits = defineEmits(['mvid']);

const sendId = (id: number | string) => {
    emits('mvid', id);
}
</script>

<style lang='scss' scoped>
.mv-list {
    display: flex;
    flex-wrap: wrap;
    padding: 10px 15px;
    box-sizing: border-box;
    margin: 0 -25px;

    .mv-list-li {
        position: relative;
        flex: 0 0 25%;
        max-width: 25%;

        .mv-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;

            &:hover .mv-info {
                color: rgb(253, 83, 83) !important;
            }

            .mv-message {
                position: relative;
                width: 260px;
                height: 160px;
                box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;

                &:hover .bofang-btn {
                    display: flex !important;
                }

                .mv-pic {
                    width: inherit;
                    height: inherit;
                }

                .mv-tips {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    height: 30px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: white;
                    background-color: rgba(0, 0, 0, .4);
                    padding: 0 15px;
                    box-sizing: border-box;
                    font-size: 14px;
                }
            }

            .mv-info {
                padding: 5px 25px 15px 25px;
                color: rgb(58, 58, 58);
            }
        }
    }
}

.bofang-btn {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    background-color: rgba(239, 237, 237, 0.909);
    z-index: 10;
    display: none;

    .bofang {
        color: rgb(249, 43, 43);
        font-size: 25px;
        transform: translateX(1px);
    }
}

.play-count {
    display: flex;
    align-items: center;
    z-index: 10;
    position: absolute;
    right: 4px;
    top: 6px;
    padding: 4px;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    color: rgba(255, 255, 255);
    font-size: 12px;

    i {
        font-size: 14px;
    }

    .count-num {
        padding-left: 3px;
        vertical-align: middle;
    }
}
</style>