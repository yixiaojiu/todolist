import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { verify } from '@/api/api'
import { ElMessage } from 'element-plus'

import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

router.beforeEach(async (to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  const { data: res } = await verify()
  if (res.code) {
    next()
  } else {
    next('/login')
  }
})

app.mount('#app')
