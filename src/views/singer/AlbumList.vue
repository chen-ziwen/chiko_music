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
                            <img :src="imgurl(sheetDetail.detail.picUrl, '500')" />
                        </div>
                        <div class="content-box">
                            <ul class="content-box-ul">
                                <li>
                                    <h1 v-html="sheetDetail.detail.name"></h1>
                                </li>
                                <li>
                                    <img :src="imgurl(sheetDetail.creator.picUrl)" />
                                    <span>{{ sheetDetail.creator.name }}</span>
                                    <span>创建于&nbsp;{{ dayjs(sheetDetail.detail.createTime).format('YYYY-MM-DD HH:mm:ss')
                                    }}</span>
                                </li>
                                <li><span>发行公司：</span>{{ sheetDetail.detail.company }}</li>
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
                            :page-size="30" @current-change="choice" v-model:currentPage="page"
                            :hide-on-single-page="true" />
                    </div>
                </template>
                <Loading v-else />
            </div>
        </div>
        <div class="music-singer-right">
            <div class="common-style">
                <ListModule head="热门专辑" gap-color="red">
                    <template v-if="sheetAbout.hotAlbums.length">
                        <div class="sheet-commond" v-for="item in sheetAbout.hotAlbums" :key="item.id"
                            @click="turnSheet(item.id)">
                            <img class="sheet-img" :src="item.picUrl + '?param=150y150'" :title="item.name">
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
                        <div class="talk-box-list" v-for="item in sheetAbout.comments" :key="item.commentId">
                            <div class="user-box">
                                <img class="talk-user-avatar" :src="item.user.avatarUrl" :title="item.user.nickname" />
                                <span class="talk-user-name">{{ item.user.nickname }}</span>
                                <span class="talk-time">{{ item.timeStr }}</span>
                            </div>
                            <p class="talk-list">{{ item.content }}</p>
                        </div>
                    </template>
                    <Loading v-else />
                </ListModule>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, toRaw } from 'vue';
import { getAlbum, getArtistAlbum, getCommentAlbum } from '@/api/http/api';
import { ScrollTop, imgurl, useSong } from '@/util';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import SongList from '@/components/song-sheet/SongList.vue';
import ListModule from '@/components/common/ListModule.vue';
import Loading from '@/components/common/loading/Loading.vue';
import { usePlay } from '@/store/play';

type Whole = Record<string, any>;
interface sheetAbout {
    subscribers: Whole[];
    comments: Whole[];
    hotAlbums: Whole[];
};
interface sheetDetail {
    detail: Whole;
    creator: Whole;
    sheetList: Whole[];
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
    hotAlbums: [],
    comments: []
});
const sheetDetail = reactive<sheetDetail>({
    detail: {},
    creator: {},
    sheetList: [],
    partsheet: [],
});
const delSong = ref<Whole[]>([]);
async function playlistDetail(id: number) {
    // 先将歌单列表数组清空
    sheetDetail.sheetList.length = 0;
    delSong.value.length = 0;
    try {
        const { songs, album } = await getAlbum(id, Date.now());
        sheetDetail.detail = album;
        sheetDetail.creator = album.artist;
        delSong.value = useSong(songs);
        loading.value = false;
        for (let i = 0; i < delSong.value.length; i += 30) {
            sheetDetail.sheetList.push(delSong.value.slice(i, i + 30));
        }
        sheetDetail.partsheet = sheetDetail.sheetList[0] || [];
    } catch (e) {
        console.error(e, 'album fail =====>');
    }
}

//把几个数据不怎么需要处理的接口放在一起请求。分别是歌单评论，相关歌单，歌单收藏
async function startSheet(id: number) {
    try {
        const { hotAlbums } = await getArtistAlbum(sheetDetail.creator.id, 5, 0);
        sheetAbout.hotAlbums = hotAlbums;  //相关歌单
        const { comments, hotComments } = await getCommentAlbum(id, 30, 0);
        if (hotComments.length) {
            sheetAbout.comments = hotComments;
        } else {
            sheetAbout.comments = comments;
        }
    } catch (e) {
        console.error(e, "request fail =====>");
    }
}

//控制分页功能
function choice(val: number) {
    if (!sheetDetail.sheetList) return;
    sheetDetail.partsheet = toRaw(sheetDetail.sheetList[val - 1]);
    scroll(5);
}

// 点击跳转歌单页面
function turnSheet(id: number) {
    router.push({ name: 'albumlist', query: { albumid: id } });
}

// 将当前歌单列表和当前索引值保存到pinia中
const playIdx = (index: number) => {
    const songArr = JSON.parse(JSON.stringify(delSong.value));
    play.selectPlay(songArr, index);
}

// 播放全部
const playAll = () => {
    const songArr = JSON.parse(JSON.stringify(delSong.value));
    play.playAll(songArr);
}

// 初始化界面
async function originContent(id: number) {
    await playlistDetail(id);
    await startSheet(id);
}

watch(() => route.query.albumid, (id) => {
    if (!id) return;
    page.value = 1;
    const sheetId = id as unknown as number;
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
            // background-color: #fcfcfc;

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
                            margin: 5px 0;

                            >span {
                                font-size: 16px;
                                color: #4a4a4a;
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
    }

    &-right {
        display: inline-block;
        width: 30%;
        padding: 0 0 0 15px;
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

        .talk-box-list {
            display: flex;
            flex-direction: column;
            padding: 5px 0px;

            .user-box {
                display: flex;
                align-items: center;

                .talk-user-avatar {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                }

                .talk-user-name {
                    width: 0;
                    flex-grow: 1;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    margin-left: 6px;
                }

                .talk-time {
                    color: rgb(100, 99, 99);
                }
            }

            .talk-list {
                padding: 5px;
                margin: 5px 0px 0px 35px;
                border: 3px dashed pink;
                font-size: 14px;
                color: rgb(76, 73, 73);
                letter-spacing: 1px;
            }



        }

        .sheet-commond {
            margin-bottom: 10px;
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            cursor: pointer;

            .sheet-img {
                width: 35px;
                height: 35px;
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