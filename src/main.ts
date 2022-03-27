import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/ts/elementPlus'
const app = createApp(App);
app.use(router);
app.use(createPinia());



app.mount('#app');

