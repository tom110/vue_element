import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'

import axios from 'axios'
import qs from 'qs'
// 配置请求的跟路径
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.defaults.baseURL = 'http://127.0.0.1:8080/'
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
Vue.prototype.$http = axios
Vue.prototype.$qs = qs
Vue.config.productionTip = false

// eslint-disable-next-line no-unused-vars
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
// 1 XE.ready()会加载Cesium.js等其他资源，注意ready()返回一个Promise对象。
// eslint-disable-next-line no-undef
// XE.ready().then(startup)
