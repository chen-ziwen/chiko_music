<template>
    <div class="music-singer">
        <div class="music-singer-left">
            <div class="music-singer-left-head">
                <div class="music-player">
                    <img :src="imgurl(sheetDetail.detail.coverImgUrl)" />
                </div>
                <div class="content-box">
                    <ul class="content-box-ul">
                        <li>
                            <h1 v-html="sheetDetail.detail.name"></h1>
                        </li>
                        <li>
                            <img :src="imgurl(sheetDetail.creator.avatarUrl)" />
                            <span>{{ sheetDetail.creator.nickname }}</span>
                            <span>创建于&nbsp;{{ dayjs(sheetDetail.detail.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
                        </li>
                        <li>
                            <span v-show="sheetDetail.detail.tags.length">标签&nbsp;:</span>
                            <span v-for="tag, index in sheetDetail.detail.tags" :key="index">{{ tag }}</span>
                        </li>
                        <li>
                            <span v-html="sheetDetail.detail.description" @click="centerDialog = true"></span>
                            <el-dialog v-model="centerDialog" :title="sheetDetail.detail.name" width="30%" center>
                                <span v-html="sheetDetail.detail.description"></span>
                            </el-dialog>
                        </li>
                        <li>
                            <span>播放全部</span>
                        </li>
                    </ul>
                </div>
            </div>
            <template v-if="sheetDetail.partsheet">
                <sheet :sheetList="sheetDetail.partsheet"></sheet>
            </template>
            <div v-if="sheetDetail.partsheet.length" class="pagination">
                <el-pagination layout="prev, pager, next" background :total="sheetDetail.detail?.trackCount || 0" :page-size="50" @current-change="choose" v-model:currentPage=page />
            </div>
        </div>
        <div class="music-singer-right">
            <div class="common-style" v-show="sheetAbout.aboutList.length > 0">
                <ListModule head="歌单推荐" gap-color="red">
                    <div class="sheet-commond" v-for="item in sheetAbout.aboutList" :key="item.id" @click="turnSheet(item.id)">
                        <img class="sheet-img" :src="item.coverImgUrl">
                        <span class="sheet-name">{{ item.name }}</span>
                    </div>
                </ListModule>
            </div>
            <div class="common-style" v-show="sheetAbout.subscribers.length > 0">
                <ListModule head="歌单收藏者" gap-color="blue">
                    <div class="box-list" v-for="item in sheetAbout.subscribers" :key="item.userId" :title="item.nickname">
                        <img class="user-avatar" :src="item.avatarUrl">
                    </div>
                </ListModule>
            </div>
            <div class="common-style" v-show="sheetAbout.comments.length > 0">
                <ListModule head="精彩评论" gap-color="green">
                    <div class="talk-box-list" v-for="item in sheetAbout.comments" :key="item.commentId">
                        <div class="user-box">
                            <img class="talk-user-avatar" :src="item.user.avatarUrl" :title="item.user.nickname" />
                            <span class="talk-user-name">{{ item.user.nickname }}</span>
                            <span class="talk-time">{{ item.timeStr }}</span>
                        </div>
                        <p class="talk-list">{{ item.content }}</p>
                    </div>
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
} from '@/api/http/api';
import { ScrollTop } from '@/utils/ways';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, reactive, ref, watch, toRefs, toRaw } from 'vue';
import sheet from '@/components/common/sheet.vue';
import dayjs from 'dayjs';
import ListModule from '@/components/common/listmodule.vue';

interface sheetAbout {
    subscribers: Record<string, any>[];
    comments: Record<string, any>[];
    aboutList: Record<string, any>[];
};
interface sheetDetail {
    detail: Record<string, any>;
    creator: Record<string, string>;
    sheetList: Record<string, any>[];
    partsheet: any;
}
const route = useRoute();
const router = useRouter();
const scroll = new ScrollTop().scroll;
const centerDialog = ref(false);
const page = ref<number>(1);
const sheetAbout = reactive<sheetAbout>({
    subscribers: [],
    aboutList: [],
    comments: []
});
const sheetDetail = reactive<sheetDetail>({
    //初始化，不想初始化就必须使用可选链或&&
    detail: { coverImgUrl: '', name: '', createTime: 0, tags: [], description: '' },
    creator: { avatarUrl: '', nickname: '' },
    sheetList: [],
    partsheet: [],
});

function imgurl(url: string) {
    if (!url) {
        return '/assets/images/ava.jpeg';
    }
    return url + '? param = 100y100';
}

async function playlistDetail(id: number) {
    // 先将歌单列表数组清空
    sheetDetail.sheetList.length = 0;

    let nowTime = new Date().getTime();
    let i = 0;
    const { playlist } = await getPlaylistDetail(id, 50, nowTime);
    if (playlist?.description) {
        playlist.description = playlist.description.replace(/\n{1,}|\r{1,}|\r{1,}\n{1,}/igm, '<br/>');
    }
    sheetDetail.detail = playlist;
    sheetDetail.creator = playlist?.creator;
    const { songs } = await getPlaylistTrackAll(id, undefined, undefined, nowTime);
    //给每一首歌添加一个顺序索引
    while (i < songs.length) {
        songs[i].index = i + 1;
        i++
    }
    //将大数组切割成指定大小的小数组集合
    for (let i = 0; i < songs.length; i += 50) {
        sheetDetail.sheetList.push(songs.slice(i, i + 50))
    }
    sheetDetail.partsheet = sheetDetail.sheetList[0] || [];
}

//把几个数据不怎么需要处理的接口放在一起请求。分别是歌单评论数，相关歌单，歌单的详细数据
function startSheet(id: number) {
    try {
        Promise.all([getPlaylistSubscribers(id, 30), getCommentPlaylist(id, 10), getRelatedPlaylist(id)])
            .then(res => {
                const { subscribers } = res[0]; // 歌单评论
                const { comments, hotComments } = res[1]; //歌单信息
                const { playlists } = res[2]; //相关歌单
                sheetAbout.subscribers = subscribers;  // 歌单收藏
                if (hotComments.length > 0) {
                    sheetAbout.comments = hotComments;
                } else {
                    sheetAbout.comments = comments;
                }
                sheetAbout.aboutList = playlists;  //相关歌单
            })
            .catch(error => {
                console.log(error)
            });
    }
    catch (error) {
        console.log(error)
    };

}
//控制分页功能
function choose(val: number) {
    if (!sheetDetail.sheetList) return;
    sheetDetail.partsheet = toRaw(sheetDetail.sheetList[val - 1]);
    // 切换分页时 屏幕回到顶部
    scroll();
}

// 点击跳转歌单
function turnSheet(id: number) {
    router.push({
        name: 'sheetlist',
        query: {
            id,
        }
    })
}
// 初始化界面
function originContent(id: number) {
    // 因为监听的是路由跳转的id，所以当从歌单跳转到发现音乐时，因为没传id，所以router.query.id为空会报错
    // 如果id为空不执行
    if (id) {
        startSheet(id);
        playlistDetail(id);
    }
}

watch(() => route.query.id, () => {
    // 跳转歌单时，将分页定位到第一页
    page.value = 1;
    let sheetId = route.query.id as unknown as number;
    originContent(sheetId as unknown as number);
}, { immediate: true })

</script>

<style lang="scss" scoped>
.music-singer {
    width: $width;
    margin: 0 auto;
    box-sizing: border-box;
    display: flex;

    &-left {
        width: 70%;
        padding: 15px;
        overflow: hidden;
        background-color: white;

        .pagination {
            width: 100%;
            @include _flex(center, center);
            margin-top: 15px;
        }

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
                                padding: 3px 8px;
                                margin: 10px 15px 0px 0px;
                                font-size: 18px;
                                cursor: pointer;
                                opacity: 0.85;
                                filter: invert(5%);
                                border-radius: 8px;
                                color: white;
                                background-color: red;
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
        padding: 15px;
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

//分页标签的颜色
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
    background-color: pink !important; //修改默认的背景色
    cursor: pointer;
}
</style>