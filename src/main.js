// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './js/router'
import store from './js/store'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import tools from './js/tools'

Vue.use(BootstrapVue)
Vue.config.productionTip = false
Vue.prototype.$tools = tools

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App},
  methods: {
    modalOpen(id) {
      this.$emit('bv::show::modal', id)
    },
    modalClose(id) {
      this.$emit('bv::hide::modal', id)
    },
    arrayToObject(toTransform, akey) {
      if (Array.isArray(toTransform)) {
        akey = akey || 'id'
        return toTransform.reduce(function (acc, cur, i) {
          acc[cur[akey]] = cur
          return acc
        }, {})
      } else {
        return toTransform
      }
    },
    clone(toSet, toClone) {
      for (var k in toClone) Vue.set(toSet, k, toClone[k])
      for (var s in toSet) {
        if (!(s in toClone)) {
          Vue.delete(toSet, s)
        }
      }
    }
  }
})
