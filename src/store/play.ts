import { defineStore } from "pinia";

export const usePlay = defineStore({
    id: 'play',
    state: () => {
        return {
            name: 'chiko',
            age: 22,
        }
    },
    actions: {
        cName(name: string) {
            this.name = name;
        }
    },
    getters: {},
})
