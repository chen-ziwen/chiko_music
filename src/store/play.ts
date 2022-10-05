import { defineStore } from "pinia";

const playType = {
    single: 0,
    loop: 1,
    random: 2
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
            // 用户信息
            userInfo: null,
            // 歌手信息
            singer: {},
            // 是否播放
            playing: false,
            // 音乐三个模式:单曲，循环，随机
            playType: playType.single,
            // 音乐列表，随机有用，当点击列表时，会把音乐url都传进来
            playList: [] as any[],
            // 当前播放歌曲在列表中的索引值
            currentindex: -1,


        }
    },
    // action类似于methods action可以传递参数，去修改state的值，同时可以进行异步的操作
    actions: {

    },
    // getters类似于计算属性，不能传递参数，默认传递state，除非返回一个函数
    getters: {
        // 拿到当前索引值的歌曲
        currentPlay(state) {
            return state.playList[state.currentindex] || {};
        }
    },
})
