import { defineStore } from "pinia";
import type { SongList } from "@/models/detail";

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
            loginStatu: false,
            // 歌单id
            sheetId: 0,
            // 用户信息
            userInfo: null,
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
    // action类似于methods action可以传递参数，去修改state的值，同时可以进行异步的操作
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
    // getters类似于computed，不能从外部传递参数，默认带state，除非返回一个函数
    getters: {
        currentPlay(state) {
            return state.playList[state.currentindex] || {}; // 拿到当前索引值的歌曲
        }
    },

    // dispath 可以同时修改多个，有做优化，同时可以更好区分哪个全局属性
    // eg. state.$dispath({ name:"chiko", age:18 });
})
