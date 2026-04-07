// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { installI18n } from '@/plugins/i18n'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import "@/plugins/echarts";
import { useAuthStore } from '@/stores/auth'
import { getAuthStorageKeys, getToken, parseAuthEvent } from '@/utils/token'



const useMock = (import.meta.env.VITE_USE_MOCK ?? '').toLowerCase() === 'true'

if (useMock) {
  const { worker } = await import('./mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
  })

  console.log('import.meta.env.BASE_URL',import.meta.env)
}

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
installI18n(app)
app.use(pinia)
app.use(router)

const authStore = useAuthStore(pinia)
window.addEventListener('storage', (event) => {
  if (event.storageArea !== localStorage) return
  const { tokenKey, roleKey, eventKey } = getAuthStorageKeys()
  if (event.key !== tokenKey && event.key !== roleKey && event.key !== eventKey) return

  if (event.key === eventKey) {
    const authEventType = parseAuthEvent(event.newValue)
    if (authEventType === 'force-logout') {
      authStore.forceLogout()
      if (router.currentRoute.value.path !== '/login') {
        router.replace('/login')
      }
      return
    }
  }

  authStore.syncFromStorage()
  if (!getToken() && router.currentRoute.value.path !== '/login') {
    router.replace('/login')
  }
})

app.mount('#app')





