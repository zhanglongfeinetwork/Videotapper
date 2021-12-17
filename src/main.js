// 兼容 IE
// https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babelpolyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 设置 js中可以访问 $cdn
import { $cdn } from '@/config'
Vue.prototype.$cdn = $cdn

// 全局引入按需引入UI库 vant
import '@/plugins/vant'

import VideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
Vue.use(VideoPlayer)
require('vue-video-player/src/custom-theme.css')

// 引入全局样式
import '@/assets/css/index.scss'
// 移动端适配
import 'lib-flexible/flexible.js'
// echarts
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts
// main.js 引入echarts方式如下
// filters
import './filters'

Vue.config.productionTip = false

import VueI18n from 'vue-i18n'
import messages from './lang'

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'zh',
  messages
})
import { Locals } from './lang/vantLocal.js'

Vue.prototype.$Local = Locals

Vue.config.productionTip = false

import navigation from '@/components/navigation'

import '@/assets/ttf/ttf.css'

// 移动端手势
// import 'hammerjs/hammer.js'
// import AlloyFinger from 'alloyfinger'
// import AlloyFingerPlugin from 'alloyfinger/vue/alloy_finger_vue'

// Vue.use(AlloyFingerPlugin, {
//   AlloyFinger
// })

// 引入手势
import '../static/alloy_finger.js'
Vue.prototype.$finger = require('../static/alloy_finger.js')

Vue.component('navigation', navigation)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
