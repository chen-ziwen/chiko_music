import { defineStore } from "pinia";
//1.定义并暴露容器
// 第一个参数：容器的id，将来Pinia会把所有的容器挂载到根容器
//第二个参数：选项对象
//返回值是一个函数，调用返回实例
const useStore = defineStore('main', {
    /**
   * 1.必须是函数，这样是为了在服务端渲染时避免交叉请求导致数据状态污染
   * 2.必须是箭头函数，这样是为了更好的TS类型推导
   *
   */
    state: () => {
        return {
            name: 'chiko',
            age: 22,
            count: 100,
            use: 'pinia使用详解'
        }
    },
    //  类似与组件的computed,有缓存的功能
    getters: {
        //如果在 getters中使用了 this 则必须手动指定返回值的类型，否则类型推导不出来
        /*     count10(): number {
          console.log('count10被调用了。')
          return this.count + 10
        }, */
        //函数接收一个可选参数：state 状态对象
        count10(state) {
            console.log('count10被调用了。')
            return state.count + 10
        },
    },
    //封装业务逻辑，修改state,类似methods 支持同步和异步
    // 比较复杂的操作利用actions来操作,简单的直接外部操作就行。
    actions: {
        changeState(num: number) {
            //this指向mainStore
            this.count += num
            this.use = '学会了吗'
        },
    },
})
//2.使用容器中的state

//3.修改state

//4.容器中的action使用
