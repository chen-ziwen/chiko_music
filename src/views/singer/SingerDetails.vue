<template>
    <div class="singer-details">
        {{ route.query.id }}
        <!-- {{ artDil }} -->
        <el-image class="singer-img" :src="artDil?.cover + '?param=300y300'"></el-image>
        <span>{{ artDil?.name }}</span>
    </div>
</template>
<script lang='ts' setup>
import { watch, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import type { SingerDetail } from '@/models'
import { getArtists, getArtistMv, getSimiArtist, getArtistAlbum, getArtistDesc, getArtistDetail } from '@/api/http/api';
const route = useRoute();
// 歌手详情  (歌曲数、专辑数)
const artDesc: { intro: [], brief: string } = reactive({ intro: [], brief: '暂无数据' });
//歌手描述 
const artDil = ref<SingerDetail>();

const artistDesc = async (id: number) => {
    try {
        const { briefDesc, introduction } = await getArtistDesc(id);
        artDesc.intro = introduction;
        artDesc.brief = briefDesc;
        console.log('desc', briefDesc, introduction);
    } catch (e) {
        console.log(e, '歌手详情请求失败');
    }
}
const artDetail = async (id: number) => {
    try {
        const { data } = await getArtistDetail(id);
        artDil.value = data.artist;
        console.log('====>', artDil);
    } catch (e) {
        console.log(e, '歌手描述请求失败');
    }

}
watch(() => route.query.id, async (id) => {
    const singerId = id as unknown as number;
    if (!singerId) return;
    console.log(id);
    await artistDesc(singerId);
    await artDetail(singerId);

}, { immediate: true })
</script>
<style lang='scss' scoped>
.singer-details {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    .singer-img {
        width: 150px;
        height: 150px;
        border-radius: 5px;
    }
}
</style>