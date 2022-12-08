import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import 'ant-design-vue/es/message/style/css'

import { createPinia } from 'pinia'

createApp(App).use(router).use(createPinia()).mount('#app')
