<template>
    <div class="talk-box-list" v-for="{ user: { nickname, avatarUrl }, commentId, timeStr, content, beReplied } in data" :key="commentId">
        <div class="user-box">
            <img class="talk-user-avatar" :src="avatarUrl" :title="nickname" />
            <div class="talk-detail">
                <span class="talk-user-name">{{ nickname }}</span>
                <span class="talk-time">{{ timeStr }}</span>
            </div>
            <slot></slot>
        </div>
        <div class="talk-list">
            {{ content }}
            <template v-if="beReplied?.length">
                <div class="content" v-for="data of beReplied" :key="data.beRepliedCommentId">
                    <span class="deepColor">@{{ data.user.nickname }}：</span>{{ data.content }}
                </div>
            </template>
        </div>
    </div>
</template>
<script lang='ts' setup>
interface TalkBoxListProps {
    data: {
        user: {
            nickname: string;
            avatarUrl: string;
        };
        content: string;
        timeStr: string;
        commentId: number;
        beReplied?: Record<string, any>[];
    }[]
}
defineProps<TalkBoxListProps>();

</script>
<style lang='scss' scoped>
.talk-box-list {
    display: flex;
    flex-direction: column;
    padding: 8px 0px;
    color: rgb(76, 73, 73);

    .user-box {
        display: flex;
        align-items: center;

        .talk-user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1px solid $color;
        }

        .talk-detail {
            width: 0;
            flex-grow: 1;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-left: 10px;
        }

        .talk-time {
            margin-left: 12px;
            color: rgb(100, 99, 99);
            font-size: 14px;
        }
    }

    .talk-list {
        padding: 5px;
        margin-left: 45px;
        border: 3px dashed pink;
        font-size: 14px;
        color: rgb(76, 73, 73);
        letter-spacing: 1px;

        .content {
            margin-top: 10px;
            background: $color;
            padding: 8px 10px;
            border-radius: 3px;
            color: rgb(76, 73, 73);

            .deepColor {
                color: #f94d4d;
            }
        }
    }
}
</style>