// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import jqajax from 'jquery-ajax'

Vue.use(BootstrapVue)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App},
  methods: {
    modalOpen(id) {
      this.$emit('bv::show::modal', id)
    },
    modalClose(id) {
      this.$emit('bv::hide::modal', id)
    },
    getCookie(sName) {
      sName = sName.toLowerCase()
      var oCrumbles = document.cookie.split(';')
      for (var i = 0; i < oCrumbles.length; i++) {
        var oPair = oCrumbles[i].split('=')
        var sKey = decodeURIComponent(oPair[0].trim().toLowerCase())
        var sValue = oPair.length > 1 ? oPair[1] : ''
        if (sKey === sName) {
          return decodeURIComponent(sValue)
        }
      }
      return ''
    },
    setCookie(sName, sValue) {
      var oDate = new Date()
      oDate.setYear(oDate.getFullYear() + 1)
      var sCookie = encodeURIComponent(sName) + '=' + encodeURIComponent(sValue) + ';expires=' + oDate.toGMTString() + ';path=/'
      document.cookie = sCookie
    },
    clearCookie(sName) {
      this.setCookie(sName, '')
    },
    checkProject() {
      var t = this
      if (t.project === '') {
        try {
          var p = JSON.parse(t.$root.getCookie('project'))
          this.project = p
        } catch (e) {
          t.projectDialog()
        }
      }
      return true
    },
    projectDialog() {
      this.modalOpen('projectModal')
    },
    get(route, data, callback, error) {
      this.apiCall(
        'GET',
        route,
        data,
        callback,
        error
      )
    },
    post(route, data, callback, error, contentType) {
      this.apiCall(
        'POST',
        route,
        data,
        callback,
        error,
        contentType
      )
    },
    patch(route, data, callback) {
      this.apiCall(
        'PATCH',
        route,
        data,
        callback
      )
    },
    getAndSet(route, toSet, editData, callback) {
      this.apiCall(
        'GET',
        route,
        null,
        function (d) {
          if (d instanceof Array) {
            d = d.reduce(function (acc, cur, i) {
              acc[cur.id] = cur
              return acc
            }, {})
          }
          if (editData) {
            editData(d)
          }
          for (var k in d) Vue.set(toSet, k, d[k])
          if (callback) {
            callback(toSet)
          }
        }
      )
    },
    placeholders(url) {
      var t = this
      return url.replace(
        ['--projectid--'],
        [t.project.id]
      )
    },
    apiCall: function (type, route, data, callback, errorCallback, formdata) {
      var ctype
      if (formdata) {
        ctype = 'application/x-www-form-urlencoded'
      } else {
        ctype = 'application/json'
      }
      data = data || {}
      errorCallback = errorCallback || function (err) {
        console.log(err)
      }
      if (this.checkProject()) {
        route = this.placeholders(route)
        var url = this.apiRoute + route
        // url += '?access_token=' + this.token + '&'
        if (type === 'GET' && data !== undefined && data !== null) {
          for (var key in data) {
            let p = data[key]
            if (typeof p === 'object') {
              p = encodeURIComponent(JSON.stringify(p))
            }
            url += key + '=' + p
          }
        }
        var ajaxObj = {
          type: type,
          url: url,
          success: callback,
          dataType: 'json',
          error: errorCallback,
          contentType: ctype
        }
        if (type !== 'GET') {
          var d
          if (formdata) {
            d = []
            for (var dkey in data) {
              let fd = new FormData()
              fd.set(dkey, data[dkey])
              d.push(fd)
            }
            ajaxObj.processData = false
          } else {
            d = JSON.stringify(data)
          }
          ajaxObj.data = d
        }
      }
      jqajax.ajax(ajaxObj)
    }
  },
  data() {
    return {
      project: '',
      apiRoute: 'http://52.15.154.204:32006/api/',
      token: 'test'
    }
  }
})
