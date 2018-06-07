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
import cookies from './tools/cookies'

Vue.use(BootstrapVue)
Vue.config.productionTip = false
Vue.prototype.$cookies = cookies

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  cookies,
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
    checkSigninAndProject() {
      var t = this
      if (t.$root.token === '') {
        let token = t.$root.getCookie('access_token')
        let d = t.$root.getCookie('access_token_validUntil')
        if (token === undefined || d < new Date()) {
          this.$root.$router.push('/signin')
          return false
        } else {
          t.$root.token = token
        }
      }
      if (t.$root.project === '') {
        try {
          var p = JSON.parse(t.$root.getCookie('project'))
          this.project = p
        } catch (e) {
          t.projectDialog()
          return false
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
    patch(route, data, callback, error) {
      this.apiCall(
        'PATCH',
        route,
        data,
        callback,
        error
      )
    },
    delete(route, id, callback) {
      route = route + '/' + id
      this.apiCall(
        'DELETE',
        route,
        {},
        callback
      )
    },
    getAndSet(route, toSet, editData, callback, data) {
      var t = this
      this.apiCall(
        'GET',
        route,
        data,
        function (data) {
          if (data instanceof Array) {
            data = t.arrayToObject(data)
          }
          if (editData) {
            data = editData(data)
          }
          t.clone(toSet, data)
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
    apiCall (type, route, data, callback, errorCallback, formdata) {
      if (!this.signingIn) {
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
        if (route === 'projects' || this.checkSigninAndProject()) {
          route = this.placeholders(route)
          let apiRoute = (window.location.hostname === 'webdev.emd-databots.com' ? this.devApiRoute : this.apiRoute)
          var url = apiRoute + route + '?accessToken=' + this.token + '&'
          if (type === 'GET' && data !== undefined && data !== null) {
            for (var key in data) {
              let p = data[key]
              if (typeof p === 'object') {
                p = encodeURIComponent(JSON.stringify(p))
              }
              url += key + '=' + p
            }
          }
          var callBackWrapper = function(data, suc, info) {
            if (data === undefined) {
              data = JSON.parse(info.responseText)
            }
            callback = callback || function () {}
            callback(data)
          }
          var ajaxObj = {
            type: type,
            url: url,
            success: callBackWrapper,
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
          } else {
            if (data !== undefined && data !== null) {
              for (var fkey in data) {
                let p = data[fkey]
                if (typeof p === 'object') {
                  p = encodeURIComponent(JSON.stringify(p))
                }
                url += key + '=' + p
              }
            }
          }
        }
        jqajax.ajax(ajaxObj)
      }
    },
    arrayToObject(toTransform, akey) {
      akey = akey || 'id'
      return toTransform.reduce(function (acc, cur, i) {
        acc[cur[akey]] = cur
        return acc
      }, {})
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
