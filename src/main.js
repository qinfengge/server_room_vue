import { createApp } from 'vue'
// import './plugins/axios'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as echarts from 'echarts'
import Aplayer from 'vue3-aplayer'

import '@/assets/css/global.css'

const app = createApp(App).use(store).use(router).use(ElementPlus,{locale: zhCn,size:"small"}).mount('#app')
app.echarts = echarts

