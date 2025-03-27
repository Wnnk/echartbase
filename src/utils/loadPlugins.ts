import { createPinia } from 'pinia'
import router from '@/router'


export function loadPlugins(app:any){
  app.use(createPinia())
  app.use(router)
}