<template>
    <div class="lyric-box">
        <Scroll class="lyric" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
                <div v-if="currentLyric">
                    <p ref="lyricLine" class="lyric-text" v-for="(item, index) of currentLyric.lines" :key="index" :class="currentLyricNum === index ? 'active' : ''">
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
import Scroll from './Scroll.vue';

interface LyricProps {
    currentLyricNum: number;
    currentLyric: Record<string, any>;
}

const props = defineProps<LyricProps>();

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

                &:active {
                    color: red;
                }
            }
        }
    }
}
</style>