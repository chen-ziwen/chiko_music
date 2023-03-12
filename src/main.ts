import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import 'element-plus/theme-chalk/el-message.css' // 引入elementPlus message样式
import directives from './directives/custom-directives';

const app = createApp(App);
// 全局注册指令
for (let item in directives) {
    app.directive(item, directives[item]);
}

app.use(router).use(createPinia()).mount('#app');

router.beforeEach((to, from, next) => {
    // chrome
    document.body.scrollTop = 0
    // firefox
    document.documentElement.scrollTop = 0
    // safari
    window.pageYOffset = 0
    next()
})
