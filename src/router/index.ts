import { createRouter, createWebHashHistory } from "vue-router";
import { routes } from './routes'
export default createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: routes,
})