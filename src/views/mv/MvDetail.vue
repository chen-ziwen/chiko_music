<template>
    <div class="mv-detail">
        <div class="mv-detail-left">
            <div class="video-container">
                <video :src="mvUrl" controls autoplay controlslist="nodownload"></video>
            </div>
            <div class="video-footer">
                <h3 class="title flex-row">
                    <i class="iconfont icon-MV"></i>
                    <span class="detail-name">{{ mvDetail.name }}</span>
                </h3>
                <div class="tag-list">
                    <a v-for="item of mvDetail.videoGroup" :key="item.id">#{{ item.name }}</a>
                </div>
                <p class="flex-row">
                    <span>发布：{{ dateFormat(mvDetail.publishTime, 'YYYY-MM-DD') }}</span>
                    <span v-if="mvDetail.playCount">播放次数：{{ changeNum(mvDetail.playCount, 1) }}</span>
                </p>
            </div>
            <div class="comments">
                <div class="title flex-row">
                    <i class="iconfont icon-xinxi"></i>
                    <span class="noticom">{{ videoInfo.commentCount }} 条评论</span>
                </div>
            </div>
            <ContentBox title="精彩评论" :font-size="18" :gap="-5" color="#4C4949" v-if="hotComments.length">
                <TalkList :data="hotComments"></TalkList>
            </ContentBox>
            <ContentBox title="最新评论" :font-size="18" :gap="-5" color="#4C4949" v-if="newComments.length">
                <TalkList :data="newComments"></TalkList>
            </ContentBox>
            <div v-if="videoInfo.commentTotal">
                <el-pagination class="pagination" layout="prev, pager, next" background :total="videoInfo.commentTotal || 0"
                    :page-size="20" @current-change="currentChange" v-model:currentPage="page"
                    :hide-on-single-page="true" />
            </div>
        </div>
        <div class="mv-detail-right">
            <div class="common-style">
                <ListModule head="视频简介" gap-color="red">
                    <p v-if="mvDetail.desc">{{ mvDetail.desc }}</p>
                    <p v-else>视频暂无简介</p>
                </ListModule>
            </div>
            <div class="common-style">
                <ListModule head="相关推荐" gap-color="blue">
                    <ul v-if="relatedMv.length">
                        <li v-for="item of relatedMv" :key="item.vid" @click="turnMvDetail(item.id)">
                            <div class="avatar">
                                <img :src="item.cover + '?param=320y180'" :alt="item.name" :title="item.name" />
                                <div class="action">
                                    <span class="play flex-center" title="播放" v-if="!item.isLive">
                                        <i class="iconfont icon-bofang1"></i>
                                    </span>
                                </div>
                            </div>
                            <div class="info text-hidden">
                                <h2 class="flex-row text-hidden">
                                    <i class="iconfont icon-MV"></i> {{ item.name }}
                                </h2>
                                <div class="author">
                                    By.<span v-for="author of item.artists" :key="author.id"><small> {{ author.name
                                    }}</small></span>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <p v-else>暂无相关推荐</p>
                </ListModule>
            </div>
        </div>
    </div>
</template>
<script lang='ts' setup>
import { watch, ref, reactive } from 'vue';
import { getMvUrl, getMvDetail, getMvDetailInfo, getCommentMv, getSimiMv } from '@/api';
import { useRoute, useRouter } from 'vue-router';
import { dateFormat, changeNum, scrollTop } from '@/util';
import { MvDetailType, VideoInfoType } from '@/models/mv';
import ListModule from '@/components/common/ListModule.vue';
import ContentBox from '@/components/common/ContentBox.vue';
import TalkList from '@/components/common/TalkList.vue';
const route = useRoute();
const router = useRouter();
const scroll = scrollTop();
let videoId = 0;
const mvUrl = ref<string>('');
const page = ref<number>(1);
const mvDetail = ref<MvDetailType>({
    desc: '',
    name: '',
    videoGroup: [],
    publishTime: 0,
    playCount: 0,
    subCount: 0,
});
const videoInfo = reactive<VideoInfoType>({
    isLike: 0,
    likeCount: 0,
    shareCount: 0,
    commentCount: 0,
    commentTotal: 0,
});

const hotComments = ref([]); // 精彩评论
const newComments = ref([]); // 最新评论
const relatedMv = ref<any[]>([]); // 相关mv

// mv 评论参数
const commentParams = {
    limit: 20,
    offset: 0,
    id: videoId,
}

const currentChange = (val: number) => {
    commentParams.offset = (val - 1) * commentParams.limit;
    useGetCommentMv(videoId);
    scroll(5);
}

// 获取mv的url
const useGetMvUrl = async (mid: number) => {
    try {
        const { data } = await getMvUrl(mid);
        mvUrl.value = data.url;
    }
    catch (e) {
        console.log(e, 'mv的url请求失败');
    }
}

// 获取mv的详情
const useGetMvDetail = async (mid: number) => {
    try {
        const { data } = await getMvDetail(mid);
        data.videoGroup.forEach((item: any) => {
            if (item.name.includes('#')) {
                item.name = item.name.replace(/#/g, '');
            }
        })
        mvDetail.value = data;
    } catch (e) {
        console.log(e, 'mv详情请求失败');
    }
}

// 获取mv的点赞评论转发
const useGetMvDetailInfo = async (mvid: number) => {
    try {
        const { liked, likedCount, shareCount, commentCount } = await getMvDetailInfo(mvid, new Date().getTime())
        videoInfo.isLike = liked;
        videoInfo.likeCount = likedCount;
        videoInfo.shareCount = shareCount;
        videoInfo.commentCount = commentCount;
    } catch (e) {
        console.log(e, '获取点赞评论转发数失败');
    }
}

// 获取mv的评论
const useGetCommentMv = async (id: number) => {
    const time = new Date().getTime();
    const params = {
        id,
        limit: commentParams.limit,
        offset: commentParams.offset,
        timestamp: time,
    }
    try {
        const { total, hotComments: hot, comments } = await getCommentMv(params);
        videoInfo.commentTotal = total;
        if (hot) {
            hotComments.value = hot;
        } else {
            hotComments.value = [];
        }
        newComments.value = comments;
    } catch (e) {
        console.log(e, 'MV评论请求失败');
    }
}

// 获取相似mv
const useGetSimiMv = async (id: number) => {
    try {
        const { mvs } = await getSimiMv(id);
        relatedMv.value = mvs;
    } catch (e) {
        console.log(e, '相关mv请求失败');
    }
}

const turnMvDetail = (id: number) => {
    router.push({ name: 'mvdetail', query: { mvid: id } })
}

watch(() => route.query.mvid, (mvid) => {
    if (mvid) {
        const id = mvid as unknown as number;
        videoId = id;
        if (route.name == 'mvdetail') {
            page.value = 1; // 分页回到第一页
            useGetMvUrl(id);
            useGetMvDetail(id);
            useGetMvDetailInfo(id);
            useGetCommentMv(id);
            useGetSimiMv(id);
        }
    }
}, { immediate: true })

</script>
<style lang='scss' scoped>
.mv-detail {
    width: $width;
    margin: 15px auto;
    box-sizing: border-box;
    display: flex;

    &-left {
        width: 70%;
        padding: 15px;
        overflow: hidden;
        background-color: #ffffff;
        border-radius: 10px;

        .video-container {
            position: relative;
            padding-top: 56.25%;

            video {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #000;
            }
        }

        .video-footer {
            margin-top: 8px;

            .title {
                font-size: 16px;
                vertical-align: middle;
                margin-bottom: 15px;

                .icon-MV {
                    font-size: 18px;
                    transform: translateY(1px);
                    color: #f85b5b;
                }

                .detail-name {
                    margin-left: 5px;
                }
            }

            .tag-list {
                margin-bottom: 8px;
                font-size: 12px;

                a {
                    color: #f85b5b;
                    margin-right: 10px;
                    cursor: pointer;
                }

            }

            p {
                font-size: 12px;

                span {
                    margin-right: 30px;
                    color: #999;
                }
            }
        }

        .comments {
            margin-top: 25px;

            .title {
                width: 100%;
                height: 50px;
                border-radius: 3px;
                padding: 0 3px;
                border-bottom: 1px solid #e8e8e8;

                i {
                    color: #666;
                    font-size: 18px;
                    margin-right: 5px;
                    transform: translateY(1.5px);
                }

                span {
                    margin-left: 5px;
                }
            }
        }

        .pagination {
            width: 100%;
            @include _flex(center, center);
            margin-top: 15px;
        }
    }

    &-right {
        display: inline-block;
        width: 30%;
        padding-left: 15px;
        overflow: hidden;

        .common-style {
            margin-bottom: 15px;
        }

        ul {
            li {
                display: flex;
                flex-direction: column;
                margin-bottom: 15px;
                cursor: pointer;

                .avatar {
                    width: 100%;
                    margin-right: 15px;
                    flex-shrink: 0;
                    position: relative;

                    img {
                        width: 100%;
                    }

                    .action {
                        display: none;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);

                        .play {
                            width: 32px;
                            height: 32px;
                            padding: 0;
                            border: none;
                            border-radius: 50%;
                            background-color: #ffffff;

                            i {
                                font-size: 12px;
                                color: #f85b5b;
                            }
                        }
                    }
                }

                .info {
                    display: flex;
                    flex: 1;
                    width: 100%;
                    height: 50px;
                    justify-content: center;
                    flex-direction: column;

                    h2 {
                        display: inline-block;
                        font-size: 14px;
                        margin-bottom: 3px;
                        margin-top: 5px;
                        min-height: 20px;

                        i {
                            color: #f85b5b;
                            font-size: 18px;
                            margin-right: 5px;
                            vertical-align: text-top;
                        }
                    }

                    .author {
                        font-size: 12px;
                        color: #a5a5c1;
                        letter-spacing: 1px;

                        span {
                            font-size: 12px;
                            color: #a5a5c1;

                            &::after {
                                content: '/';
                                margin-left: 5px;
                            }

                            &:last-child {
                                &::after {
                                    content: ''
                                }
                            }
                        }
                    }
                }

                &:hover {
                    .action {
                        display: flex;
                    }
                }
            }
        }
    }
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
    background-color: pink !important; //修改默认的背景色
    cursor: pointer;
}

:deep(.el-pagination) {
    --el-pagination-hover-color: pink !important;
}
</style>