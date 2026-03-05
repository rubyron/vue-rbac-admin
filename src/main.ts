// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { installI18n } from '@/plugins/i18n'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import "@/plugins/echarts";

import App from './App.vue'
import router from './router'


const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
installI18n(app)
app.use(createPinia())
app.use(router)

app.mount('#app')
