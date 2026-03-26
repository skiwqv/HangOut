import { createApp } from 'vue'
import './assets/style/index.css'
import App from './App.vue'
import { router } from './router'
import { createPinia } from 'pinia'
import '@vuepic/vue-datepicker/dist/main.css'

const pinia = createPinia()
const app = createApp(App)

app.directive('click-outside', {
  mounted(el, binding) {
    el._clickOutside = (e: Event) => {
      if (!el.contains(e.target as Node)) binding.value()
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  }
})

app.use(router)
app.use(pinia)
app.mount('#app')
