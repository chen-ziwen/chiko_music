//登陆路由 和页面到主要路由 ，路由组件全部放在view中
const loginRouter = {
    path: '/login',
    name: 'login',
    // redirect: {
    //     name: 'login'
    // },
    meta: {
        title: '登陆chikoMusic',
        isLogin: true
    },
    component: () => import('../view/login.vue'),
}

const mainRouter = {
    path: '/home',
    name: 'home',
    // redirect: {
    //     name: 'home'
    // },
    meta: {
        title: '首页',
    },
    component: () => import('../view/hello.vue'),
    // children: [
    //     {
    //         path: 'children',
    //         name: 'children',
    //         // component: () => import("@/views/discover/Discover.vue"),
    //         meta: {
    //             title: '儿子'
    //         }
    //     },
    // ]
}

export const routes = [loginRouter, mainRouter];