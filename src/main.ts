import './assets/styles/main.css'
import { createApp } from 'vue'
import { loadPlugins } from './utils/loadPlugins'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from '@/router'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
// loadPlugins(app);

app.mount('#app')
