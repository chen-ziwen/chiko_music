<template>
    <div class="lyric-box">
        <Scroll class="lyric" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
                <div v-if="currentLyric">
                    <p v-for="(item, index) of currentLyric.lines" :ref="(el: any) => lyricLine.push(el)" class="lyric-text" :key="index" :class="currentLyricNum === index ? 'active' : ''">
                        {{ item.txt }}
                    </p>
                </div>
                <div class="no-lyric" v-else>暂无歌词，请您欣赏</div>
            </div>
        </Scroll>
        <div class="foot"></div>
    </div>
</template>
<script lang='ts' setup>
import { ref } from 'vue';
import Scroll from './Scroll.vue';

interface LyricProps {
    currentLyricNum: number;
    currentLyric: any;
}
defineProps<LyricProps>();
const lyricList = ref<InstanceType<typeof Scroll> | null>(null);
const lyricLine = ref<HTMLElement[]>([]);
defineExpose({
    lyricLine,
    lyricList,
})
</script>
<style lang='scss' scoped>
.lyric-box {
    .lyric {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 430px;
        overflow: hidden;

        .lyric-wrapper {
            width: 100%;
            margin: 0 auto;
            overflow: hidden;

            .lyric-text {
                margin: 5px 0;
                line-height: 24px;
                font-size: 14px;
                font-weight: 300;

                &.active {
                    color: red;
                }
            }
        }
    }
}
</style>