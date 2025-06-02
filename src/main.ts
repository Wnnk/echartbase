import './assets/styles/main.css'
import { createApp } from 'vue'
import { loadPlugins } from './utils/loadPlugins'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from '@/router'
import 'element-plus/dist/index.css'
import { permission } from './directives/permission'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(createPinia())
app.use(router)
app.directive('permission', permission)
// loadPlugins(app);

app.mount('#app')
