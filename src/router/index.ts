import { createRouter, createWebHistory, } from "vue-router";
import { routes } from './routes';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
});

router.beforeEach((to, from, next) => {
    document.title = <string>to.meta.title;
    // chrome
    document.body.scrollTop = 0
    // firefox
    document.documentElement.scrollTop = 0
    // safari
    window.pageYOffset = 0
    next();
});

export default router;