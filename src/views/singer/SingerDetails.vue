<template>
    <div class="singer-details">
        {{ route.query.id }}
    </div>
</template>
<script lang='ts' setup>
import { useRoute } from 'vue-router';
import { getArtists, getArtistMv, getSimiArtist, getArtistAlbum, getArtistDesc } from '@/api/http/api';
const route = useRoute();
</script>
<style lang='scss' scoped>
.singer-details {
    background-color: red;
    width: 100%;
    height: 100%;
}
</style>