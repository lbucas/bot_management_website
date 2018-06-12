// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import jqajax from 'jquery-ajax'
import tools from './tools'

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
  data() {
    return {
      project: '',
      apiRoute: 'https://api.emd-databots.com/',
      devApiRoute: 'https://api.emd-databots.com/',
      token: '',
      signingIn: false
    }
  },
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
