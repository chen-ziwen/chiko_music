import { createApp } from 'vue';
import App from '../../App.vue'
const app = createApp(App);

import {
    ElButton, ElCard, ElRow,
} from 'element-plus';


app.component('el-button', ElButton);
app.component('el-row', ElRow);
app.component('el-card', ElCard)