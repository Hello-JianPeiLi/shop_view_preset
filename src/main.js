import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入element-ui样式
import 'element-ui/lib/theme-chalk/index.css'
// 导入字体图标样式
import './assets/font/iconfont.css'
// 导入axios
import axios from 'axios'
// 解决 chrome tochmove问题
import 'default-passive-events'
// 给每个请求加上token
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 配置请求根路径
axios.defaults.baseURL = 'http://localhost:8889/api/private/v1/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)
  const year = dt.getFullYear()
  const month = (dt.getMonth() + 1 + '').padStart(2, '0')
  const day = (dt.getDate() + '').padStart(2, '0')
  const hour = (dt.getHours() + '').padStart(2, '0')
  const min = (dt.getMinutes() + '').padStart(2, '0')
  const sec = (dt.getSeconds() + '').padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${min}:${sec}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
