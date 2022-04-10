import { createApp } from 'vue';
import App from '@/App.vue'
const app = createApp(App);

// 使用了按需自动引入插件 所以这边就不需要写了 不过还是留下来 以后可能需要写
import {
    ElButton, ElCard, ElRow,
} from 'element-plus';


// app.component('el-button', ElButton);
// app.component('el-row', ElRow);
// app.component('el-card', ElCard)