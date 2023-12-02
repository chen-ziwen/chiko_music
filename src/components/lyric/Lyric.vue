<template>
    <Scroll class="lyric" ref="lyricList" :data="currentLyric && currentLyric.lines">
        <div class="lyric-wrapper">
            <div v-if="currentLyric && currentLyric.lines.length">
                <p ref="lyricLine" class="lyric-text" v-for="(item, index) of currentLyric.lines"
                    :class="currentLyricNum === index ? 'active' : ''" :key="index">
                    {{ item.txt }}
                </p>
            </div>
            <div v-else class="lyric-empty">
                <p v-if="currentLyric && currentLyric.lines">纯音乐，请欣赏</p>
                <p v-else>歌词加载中...</p>
            </div>
        </div>
    </Scroll>
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

defineExpose({ lyricLine, lyricList });
</script>
<style lang='scss' scoped>
.lyric {
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

        .lyric-empty {
            color: rgb(239, 135, 152);
        }
    }
}
</style>