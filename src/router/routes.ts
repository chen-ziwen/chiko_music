//登陆路由 和页面到主要路由 ，路由组件全部放在view中
const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: '登陆chikoMusic',
        isLogin: true
    },
    component: () => import('../views/login.vue'),
}

const mainRouter = {
    path: '/',
    redirect: {
        name: 'home'
    },
    meta: {
        title: '首页',
        keepAlive: true
    },
    component: () => import('../views/hello.vue'),
    children: [
        {
            path: 'home',
            name: 'home',
            meta: {
                title: '首页',
            },
            component: () => import('../views/hello.vue'),
        }
    ]
}

export const routes = [loginRouter, mainRouter];