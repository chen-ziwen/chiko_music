<template>
    <div class="music-singer">
        <div class="music-singer-left">
            <div class="music-singer-left-head">
                <el-skeleton :loading="loading" animated>
                    <template #template>
                        <div class="ske-item">
                            <el-skeleton-item class="el-skl-img" variant="image" />
                            <div class="el-skl-txt">
                                <el-skeleton-item v-for="i in 5" :class="'el-skl-txt-item el-skl-txt-item-' + i" :key="i"
                                    variant="text" />
                            </div>
                        </div>
                    </template>
                    <template #default>
                        <div class="music-player">
                            <img :src="imgurl(sheetDetail.detail.coverImgUrl, '500')" />
                        </div>
                        <div class="content-box">
                            <ul class="content-box-ul">
                                <li>
                                    <h1 v-html="sheetDetail.detail.name"></h1>
                                </li>
                                <li>
                                    <img :src="imgurl(sheetDetail.creator.avatarUrl)" />
                                    <span>{{ sheetDetail.creator.nickname }}</span>
                                    <span>创建于&nbsp;{{ dayjs(sheetDetail.detail.createTime).format('YYYY-MM-DD HH:mm:ss')
                                    }}</span>
                                </li>
                                <li>
                                    <span v-show="sheetDetail.detail.tags.length">标签&nbsp;:</span>
                                    <span v-for="(tag, index) of sheetDetail.detail.tags" :key="index"
                                        @click="commonSheet(tag)">{{
                                            tag }}</span>
                                </li>
                                <li>
                                    <span v-html="sheetDetail.detail.description" @click="centerDialog = true"></span>
                                    <el-dialog v-model="centerDialog" :title="sheetDetail.detail.name" width="30%" center>
                                        <span v-html="sheetDetail.detail.description"></span>
                                    </el-dialog>
                                </li>
                                <li>
                                    <span @click="playAll">播放全部</span>
                                </li>
                            </ul>
                        </div>
                    </template>
                </el-skeleton>
            </div>
            <div class="music-singer-left-content">
                <template v-if="sheetDetail.partsheet.length">
                    <SongList :sheetList="sheetDetail.partsheet" @playIdx="playIdx" />
                    <div class="pagination">
                        <el-pagination layout="prev, pager, next" background :total="sheetDetail.detail?.trackCount || 0"
                            :page-size="50" @current-change="choice" v-model:currentPage="page"
                            :hide-on-single-page="true" />
                    </div>
                </template>
                <Loading v-else />
            </div>
        </div>
        <div class="music-singer-right">
            <div class="common-style">
                <ListModule head="歌单推荐" gap-color="red">
                    <template v-if="sheetAbout.aboutList.length">
                        <div class="sheet-commond" v-for="item in sheetAbout.aboutList" :key="item.id"
                            @click="turnSheet(item.id)">
                            <img class="sheet-img" :src="item.coverImgUrl">
                            <span class="sheet-name">{{ item.name }}</span>
                        </div>
                    </template>
                    <Loading v-else />
                </ListModule>
            </div>
            <div class="common-style">
                <ListModule head="歌单收藏者" gap-color="blue">
                    <template v-if="sheetAbout.subscribers.length">
                        <div class="box-list" v-for="item in sheetAbout.subscribers" :key="item.userId"
                            :title="item.nickname">
                            <img class="user-avatar" :src="item.avatarUrl">
                        </div>
                    </template>
                    <Loading v-else />
                </ListModule>
            </div>
            <div class="common-style">
                <ListModule head="精彩评论" gap-color="green">
                    <template v-if="sheetAbout.comments.length">
                        <TalkList :data="sheetAbout.comments" />
                    </template>
                    <Loading v-else />
                </ListModule>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    getPlaylistDetail,
    getRelatedPlaylist,
    getPlaylistTrackAll,
    getCommentPlaylist,
    getPlaylistSubscribers,
} from '@/api';
import { ScrollTop, imgurl, useSong } from '@/util';
import { useRoute, useRouter } from 'vue-router';
import { reactive, ref, watch, toRaw, onActivated } from 'vue';
import SongList from '@/components/song-sheet/SongList.vue';
import dayjs from 'dayjs';
import ListModule from '@/components/common/ListModule.vue';
import TalkList from '@/components/common/TalkList.vue';
import Loading from '@/components/common/loading/Loading.vue';
import { usePlay } from '@/store/play';

interface sheetAbout {
    subscribers: any[];
    comments: any[];
    aboutList: any[];
};
interface sheetDetail {
    detail: any;
    creator: Record<string, string>;
    sheetList: any[];
    partsheet: any;
}
const route = useRoute();
const router = useRouter();
const scroll = new ScrollTop().scroll;
const centerDialog = ref(false);
const play = usePlay();
const page = ref<number>(1);
const loading = ref(true);
const sheetAbout = reactive<sheetAbout>({
    subscribers: [],
    aboutList: [],
    comments: []
});
const sheetDetail = reactive<sheetDetail>({
    detail: { tags: [] },
    creator: {},
    sheetList: [],
    partsheet: [],
});
const delSong = ref<any[]>([]);

async function playlistDetail(id: number) {
    try {
        sheetDetail.sheetList.length = 0;
        delSong.value.length = 0;
        const now = Date.now();
        const { playlist } = await getPlaylistDetail(id, 50, now);
        if (playlist?.description) {
            playlist.description = playlist.description.replace(/\n{1,}|\r{1,}|\r{1,}\n{1,}/igm, '<br/>');
        }
        sheetDetail.detail = playlist;
        sheetDetail.creator = playlist?.creator;
        loading.value = false;
        const { songs } = await getPlaylistTrackAll(id, undefined, undefined, now);
        delSong.value = useSong(songs);
        for (let i = 0; i < delSong.value.length; i += 50) {
            sheetDetail.sheetList.push(delSong.value.slice(i, i + 50))
        }
        sheetDetail.partsheet = sheetDetail.sheetList[0] || [];
    } catch (e) {
        console.error(e, "get play list detail fail ===>");
    }
}

// 歌单评论，相关歌单，歌单收藏
async function startSheet(id: number) {
    try {
        const { subscribers } = await getPlaylistSubscribers(id, 30);
        const { playlists } = await getRelatedPlaylist(id);
        const { comments, hotComments } = await getCommentPlaylist(id, 10);
        sheetAbout.subscribers = subscribers;  // 歌单收藏
        sheetAbout.aboutList = playlists;  //相关歌单
        if (hotComments.length) {
            sheetAbout.comments = hotComments;
        } else {
            sheetAbout.comments = comments;
        }
    } catch (e) {
        console.error(e, "get start sheet fail ===>");
    }
}

function choice(val: number) {
    if (!sheetDetail.sheetList) return;
    sheetDetail.partsheet = toRaw(sheetDetail.sheetList[val - 1]);
    scroll(5);
}

// 点击跳转歌单页面
function turnSheet(id: number) {
    router.push({ name: 'sheetlist', query: { sheetid: id } });
}

function commonSheet(name: string) {
    router.push({ name: 'songsheet', query: { name } });
}
// 初始化界面
function originContent(id: number) {
    startSheet(id);
    playlistDetail(id);
}

const playIdx = (idx: number) => {
    const songArr = JSON.parse(JSON.stringify(delSong.value));
    play.selectPlay(songArr, idx);
}

// 播放全部
const playAll = () => {
    const songArr = JSON.parse(JSON.stringify(delSong.value));
    play.playAll(songArr);
}

watch(() => route.query.sheetid, (id) => {
    if (!id) return;
    page.value = 1;
    let sheetId = id as unknown as number;
    originContent(sheetId);
}, { immediate: true })

</script>

<style lang="scss" scoped>
.music-singer {
    width: $width;
    margin: 15px auto;
    box-sizing: border-box;
    display: flex;

    &-left {
        width: 70%;
        padding: 15px;
        overflow: hidden;
        background-color: white;
        border-radius: 10px;
        align-items: center;

        .music-player {
            position: relative;
            width: 200px;
            height: 200px;

            &::before {
                position: absolute;
                content: "";
                display: inline-block;
                width: 190px;
                height: 190px;
                border-radius: 10px;
                background-color: rgba(0, 0, 0, 0.25);
                left: 16px;
                top: 16px;
                z-index: 0;
            }

            >img {
                position: relative;
                width: 100%;
                height: 100%;
                border-radius: 10px;
            }
        }

        &-head {
            margin-bottom: 20px;
            @include _flex(center, center);

            .content-box {
                flex: 1;
                padding-left: 40px;

                &-ul {
                    @include _flex(center, flex-start);
                    flex-direction: column;
                    overflow: hidden;

                    li {
                        flex: 1;
                        height: 50px;
                        padding-top: 10px;
                        font-family: Arial;

                        &:nth-child(1) {
                            h1 {
                                display: inline;
                                color: #4a4a4a;
                            }
                        }

                        &:nth-child(2) {
                            @include _flex(center, center);
                            font-size: 18px;

                            >span:first-of-type {
                                margin-left: 10px;
                                color: #545454;
                            }

                            >span:last-of-type {
                                margin-left: 30px;
                                color: #808080;
                            }
                        }

                        >img {
                            width: 35px;
                            height: 35px;
                            border-radius: 50%;
                        }

                        &:nth-child(3) {
                            @include _flex(center, center);

                            >span:first-of-type {
                                font-size: 18px;
                                font-weight: 700;
                            }

                            >span:not(:first-of-type) {
                                display: inline-block;
                                padding: 2px 4px;
                                margin: 0px 5px;
                                font-size: 14px;
                                color: white;
                                background-color: red;
                                border-radius: 3px;
                                opacity: 0.8;
                                filter: invert(10%);
                                cursor: pointer;
                            }
                        }

                        &:nth-child(4) {
                            display: -webkit-box;
                            overflow: hidden;
                            -webkit-line-clamp: 2;
                            line-clamp: 2;
                            -webkit-box-orient: vertical;

                            >span {
                                display: block;
                                cursor: pointer;
                                transition: color 250ms ease-in-out;
                                letter-spacing: 1px;

                                &:hover {
                                    color: rgb(250, 125, 144);
                                }
                            }
                        }

                        &:nth-child(5) {
                            width: 100%;
                            text-align: end;

                            >span {
                                display: inline-block;
                                padding: 6px 15px;
                                margin: 10px 15px 0px 0px;
                                font-size: 16px;
                                cursor: pointer;
                                opacity: 0.85;
                                filter: invert(5%);
                                border-radius: 8px;
                                color: white;
                                background-color: red;

                                &:hover {
                                    color: rgb(250, 125, 144);
                                }
                            }
                        }
                    }
                }
            }
        }

        &-content {
            align-self: center;
        }
    }

    &-right {
        display: inline-block;
        width: 30%;
        padding-left: 15px;
        overflow: hidden;

        .box-list {
            display: inline-block;
            width: 20%;
            text-align: center;
            margin-bottom: 8px;
            cursor: pointer;

            .user-avatar {
                width: 40px;
                height: 40px;
                border-radius: 10px;
            }
        }

        .sheet-commond {
            margin-bottom: 10px;
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            cursor: pointer;

            .sheet-img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-right: 10px;
            }

            .sheet-name {
                display: inline-block;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }

        .common-style {
            margin-bottom: 15px;
        }
    }
}

.el-skeleton {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .ske-item {
        display: flex;
        margin: 15px 15px 40px 15px;

        .el-skl-img {
            flex-shrink: 0;
            width: 180px;
            height: 180px;
            margin-right: 40px;
        }

        .el-skl-txt {
            width: 100%;
            display: flex;
            flex-direction: column;

            &-item {
                height: 18px;
                margin: 10px 0;

                &-1,
                &-2 {
                    width: 80%;
                }

                &-3 {
                    width: 40%;
                }

                &-4 {
                    width: 60%;
                }

                &-5 {
                    align-self: flex-end;
                    width: 20%;
                }
            }
        }
    }
}
</style>