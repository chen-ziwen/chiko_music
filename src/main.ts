import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import 'element-plus/theme-chalk/el-message.css';
import directives from './directives/custom-directives';

const app = createApp(App);

for (let item in directives) {
    app.directive(item, directives[item]);
}

app.use(router).use(createPinia()).mount('#app');

