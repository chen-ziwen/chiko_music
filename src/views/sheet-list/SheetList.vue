<template>
    <div class="music-singer">
        <div class="music-singer-left">
            <div class="music-singer-left-all">
                <img :src="sheetDetail.detail?.coverImgUrl + '? param = 200y200'" />
                <div class="content-box">
                    <ul class="content-box-ul">
                        <li>
                            <h1 v-html="sheetDetail.detail?.name"></h1>
                        </li>
                        <li>
                            <img :src="sheetDetail.creator?.avatarUrl" />
                            <span>{{ sheetDetail.creator?.nickname }}</span>
                            <span>创建于&nbsp;{{ dayjs(sheetDetail.detail?.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
                        </li>
                        <li>
                            <span>标签&nbsp;:</span>
                            <span v-for="tag, index in sheetDetail.detail?.tags" :key="index">{{ tag }}</span>
                        </li>
                        <li>
                            <span v-html="sheetDetail.detail?.description" @click="centerDialog = true"></span>

                            <el-dialog v-model="centerDialog" :title="sheetDetail.detail?.name" width="30%" center class="diglog">
                                <span v-html="sheetDetail.detail?.description"></span>
                            </el-dialog>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="music-singer-right">
            <div class="music-singer-right-desc" v-html="sheetDetail.detail?.description"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    getPlaylistDetail,
    getRelatedPlaylist,
    getPlaylistTrackAll,
    getDetailDynamic,
    getSongDetail,
    getCommentPlaylist
} from '@/api/http/api';
import { useRoute } from 'vue-router';
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import dayjs from 'dayjs';
const centerDialog = ref(false)
interface sheetAbout {
    comments?: Record<string, any>,
    sheetMsg?: Record<string, number | boolean | null>
    aboutList?: any[],
};
interface sheetDetail {
    detail?: Record<string, any>,
    trackIds?: number[],
    creator?: Record<string, any>
}
const sheetAbout = reactive<sheetAbout>({});
const sheetDetail = reactive<sheetDetail>({});
const route = useRoute();
let sheetId = route.query.id as unknown as number;
async function playlistDetail() {
    let nowTime = new Date().getTime();
    const { playlist, privileges } = await getPlaylistDetail(sheetId, 32, nowTime);
    if (playlist.description) {
        playlist.description = playlist.description.replace(/\n{1,}|\r{1,}|\r{1,}\n{1,}/igm, '<br/>');
    }
    sheetDetail.detail = playlist;
    sheetDetail.trackIds = playlist.trackIds;
    sheetDetail.creator = playlist.creator;
    console.log('lallala', playlist)
}
//把几个数据不怎么需要处理的接口放在一起请求。分别是歌单评论数，相关歌单，歌单的详细数据
function startSheet(msg: number) {
    try {
        Promise.all([getCommentPlaylist(msg, 50), getDetailDynamic(msg), getRelatedPlaylist(msg)])
            .then(res => {
                const { comments } = res[0]; // 歌单评论
                const sheetMsg = res[1]; //歌单信息
                const { playlists } = res[2]; //相关歌单
                sheetAbout.comments = comments;
                sheetAbout.sheetMsg = sheetMsg;
                sheetAbout.aboutList = playlists;
                console.log('我是多个api的结合', sheetAbout)
            })
            .catch(error => {
                throw error
            });
    }
    catch (error) {
        console.log(error)
    };

}
function showAll() {
    alert('你好我爱你')
}
onMounted(() => {
    startSheet(sheetId);
    playlistDetail()

})

</script>

<style lang="scss" scoped>
.music-singer {
    width: $width;
    margin: 0 auto;
    box-sizing: border-box;
    @include _flex(center, center);
    &-left {
        display: inline-block;
        width: 70%;
        background-color: white;
        height: 800px;
        padding: 15px;
        &-all {
            @include _flex(center, center);
            background-color: $color;
            > img {
                width: 200px;
                height: 200px;
                border-radius: 10px;
            }
            .content-box {
                flex: 1;
                padding-left: 20px;
                height: 200px;
                &-ul {
                    height: 200px;
                    @include _flex(center, flex-start);
                    flex-direction: column;
                    overflow: hidden;
                    li {
                        flex: 1;
                        height: 50px;
                        padding: 5px 0px;
                        &:nth-child(2) {
                            @include _flex(center, center);
                            font-size: 18px;
                            > span:first-of-type {
                                margin-left: 10px;
                            }
                            > span:last-of-type {
                                margin-left: 30px;
                            }
                        }
                        > img {
                            width: 35px;
                            height: 35px;
                            border-radius: 50%;
                        }
                        &:nth-child(3) {
                            @include _flex(center, center);
                            > span:first-of-type {
                                font-size: 18px;
                                font-weight: 700;
                                font-style: italic;
                            }
                            > span:not(:first-of-type) {
                                display: inline-block;
                                background-color: red;
                                margin: 0px 5px;
                                padding: 3px 8px;
                                color: white;
                                border-radius: 20px;
                                cursor: pointer;
                            }
                        }
                        &:nth-child(4) {
                            display: -webkit-box;
                            overflow: hidden;
                            -webkit-line-clamp: 2;
                            line-clamp: 2;
                            -webkit-box-orient: vertical;
                            > span {
                                display: block;
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
        }
    }
    &-right {
        display: inline-block;
        width: 30%;
        height: 800px;
        padding: 15px;
        overflow: hidden;
        background-color: white;
        &-desc {
            overflow: hidden;
            background-color: rgb(254, 236, 239);
            height: 800px;
        }
    }
}
</style>