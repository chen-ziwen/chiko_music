<template>
    <template v-if="data.length">
        <div class="singer-msg" v-for="(item, index) in data" :key="index">
            <span class="text-tag">{{ item.ti }}：</span><br>
            <div class="text-content" v-html="textWrap(item.txt)"></div>
        </div>
    </template>
    <p class="singer-text" v-else>{{ text }}</p>
</template>
<script lang='ts' setup>
interface SingerMsgProps {
    data: { ti: string, txt: string }[];
    text: string;
}
const props = defineProps<SingerMsgProps>();

const textWrap = (text: string) => {
    let singerText = '';
    const textArr = text.split('\n');
    for (let i of textArr) {
        singerText += `<p class="singer-text">${i}</p>`
    }
    return singerText;
}

</script>
<style lang='scss' scoped>
.singer-msg {
    .text-tag {
        font-size: 16px;
        font-weight: 700;
        color: #252525;
        margin: 15px 0;
    }

    .text-content {
        font-size: 14px;
        white-space: pre-line;
        color: #595959;
        padding: 10px 0 20px 0;

        &:deep(.singer-text) {
            text-indent: 2em;
            line-height: 28px;
        }
    }
}

.singer-msg:first-child {
    margin-top: 20px;
}

.singer-text {
    text-indent: 2em;
    line-height: 28px;
}
</style>