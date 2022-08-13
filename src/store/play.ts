import { defineStore } from "pinia";

export const usePlay = defineStore({
    id: 'play',
    state: () => {
        return {
            userInfo: null,
            singer: {},
            //播放状态
            playing: false,
            name: '',
            age: 0
        }
    },
    actions: {
        cName(name: string) {
            console.log(name);

        }
    },
    getters: {},
})
