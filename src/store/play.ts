import { defineStore } from "pinia";
import type { SongList } from "@/models/detail";
import { storage } from "@/util";


export const playState = {
    listloop: 0,
    loop: 1,
    random: 2,
}

export const usePlay = defineStore({
    id: 'playing',
    state: () => {
        return {
            // 底部音乐播放器是否显示
            barShow: false,
            songUrl: '',
            // 是否登陆
            isLogin: false,
            // 歌单id
            sheetId: 0,
            // 用户信息
            userInfo: null as (null | {}),
            // 歌手信息
            singer: {},
            // 是否播放
            playing: false,
            // 音乐三个模式:列表循环，单曲循环，随机
            playType: playState.listloop,
            // 音乐列表，随机有用，当点击列表时，会把音乐url都传进来
            playList: [] as SongList[],
            // 当前播放歌曲在列表中的索引值
            currentindex: -1,
        }
    },
    actions: {
        // 根据索引播放对应歌曲
        selectPlay(list: SongList[], idx: number) {
            this.$state.playList = list;
            this.$state.currentindex = idx;
            this.$state.playing = true;
        },
        // 播放全部
        playAll(list: SongList[]) {
            this.selectPlay(list, 0);
            this.$state.playType = playState.listloop;
        }
    },
    getters: {
        currentPlay(state) {
            return state.playList[state.currentindex] || {}; // 拿到当前索引值的歌曲
        },

        getIsLogin(state): boolean {
            return state.isLogin || storage.get("isLogin");
        },

        getUserInfo(state) {
            return state.userInfo || (storage.get("loginInfo") || {});
        }
    }
})
