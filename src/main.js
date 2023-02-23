import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/css/reset.css'
import './assets/iconfont/iconfont.css'
import './permission'
import 'default-passive-events'
import VueNumber from 'vue-number-animation'
import axios from "axios";
await axios.get('/config.json').then(res => {
    axios.defaults.baseURL = res.data[res.data.env];
})
const app = createApp(App)
app.use(router).use(store).use(ElementPlus).use(VueNumber).mount('#app')

