import { createApp } from 'vue'
import App from './App.vue'
import { BootstrapVue3 } from 'bootstrap-vue-3'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

// Local development: register BkUI from local files
import BkUI from '../../client/UI/BkUI'

const app = createApp(App)
app.use(BootstrapVue3)
app.use(BkUI)
app.mount('#app')
