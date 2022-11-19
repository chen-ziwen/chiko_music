//登陆路由 和页面到主要路由 ，路由组件全部放在view中
import home from '@/views/home-page/HomePage.vue';

const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: '登陆chikoMusic',
        isLogin: true,
        keepAlive: false
    },
    component: () => import('../views/login.vue'),
}

const mainRouter = [
    // 路由的最佳写法
    {
        path: '/',
        name: 'home',
        redirect: { name: 'discover' },
        meta: {
            title: '首页',
            keepAlive: true
        },
        component: home,
        children: [
            {
                path: 'discover',
                name: 'discover',
                meta: {
                    title: '发现音乐',
                    keepAlive: true,
                },
                component: () => import('@/views/discover-music/DiscoverMusic.vue')
            },
            {
                path: 'singer',
                name: 'singer',
                meta: {
                    title: '歌手',
                    keepAlive: false
                },
                component: () => import('@/views/singer/Singer.vue')
            },
            {
                path: 'singerdetails',
                name: 'singerdetails',
                meta: {
                    title: '歌手详情',
                    keepAlive: false
                },
                component: () => import('@/views/singer/SingerDetails.vue')
            },
            {
                path: 'songsheet',
                name: 'songsheet',
                meta: {
                    title: '歌单',
                    keepAlive: true
                },
                component: () => import('@/views/song-sheet/SongSheet.vue')
            },
            {
                path: 'sheetlist',
                name: 'sheetlist',
                meta: {
                    title: '歌单详情',
                    keepAlive: true,
                },
                component: () => import('@/views/song-sheet/SheetList.vue')
            },
            {
                path: 'albumlist',
                name: 'albumlist',
                meta: {
                    title: '专辑详情',
                    keepAlive: true,
                },
                component: () => import('@/views/singer/AlbumList.vue')
            },
            {
                path: 'boutiquesongsheet',
                name: 'boutiquesongsheet',
                meta: {
                    title: '精品歌单',
                    keepAlive: true,
                },
                component: () => import('@/views/song-sheet/BoutiqueSongSheet.vue')
            },
            {
                path: 'ranklist',
                name: 'ranklist',
                meta: {
                    title: '排行榜',
                    keepAlive: true
                },
                component: () => import('@/views/rank/RankList.vue')

            },
            {
                path: 'mv',
                name: 'mv',
                meta: {
                    title: 'mv',
                    keepAlive: false
                },
                component: () => import('@/views/mv/Mv.vue')

            },
            {
                path: 'newdisc',
                name: 'newdisc',
                meta: {
                    title: '新碟',
                    keepAlive: false
                },
                component: () => import('@/views/new-disc/NewDisc.vue')
            },
            // {
            //     path: 'test',
            //     name: 'test',
            //     meta: {
            //         title: '测试',
            //         keepAlive: true
            //     },
            //     component: () => import('@/views/test/Test.vue')
            // },
        ]
    },

]

export const routes = [loginRouter, ...mainRouter];