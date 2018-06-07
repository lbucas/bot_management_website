import jqajax from 'jquery-ajax'
import Promise from 'bluebird'

const mainUrl = 'https://api.emd-databots.com/'
const devUrl = 'https://api.emd-databots.com/'

const api = {
  token: '',
  projectId: '',
  get: function (route, data) {
    return new Promise(function (resolve, reject) {
      route = api.translateRoute(route)
      api.call('GET', route)
        .then((data) => {
          data = api.arrayToObject(data)
          resolve(data)
        }, (err) => {
          reject(err)
        })
    })
  },
  call: function (type, route, data) {
    return new Promise(function (resolve, reject) {
      data = data || {}
      var callBackWrapper = function (data, suc, info) {
        if (data === undefined) {
          data = JSON.parse(info.responseText)
        }
        resolve(data)
      }
      var errorCallback = function (err) {
        reject(err)
      }
      let apiRoute = (window.location.hostname === 'webdev.emd-databots.com' ? devUrl : mainUrl)
      var url = apiRoute + route + '?accessToken=' + api.token + '&'
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
        success: callBackWrapper,
        dataType: 'json',
        error: errorCallback,
        contentType: 'application/json'
      }
      if (type !== 'GET') {
        ajaxObj.data = JSON.stringify(data)
      } else {
        if (data !== undefined && data !== null) {
          for (var fkey in data) {
            let p = data[fkey]
            if (typeof p === 'object') {
              p = encodeURIComponent(JSON.stringify(p))
            }
            url += key + '=' + p + '&'
          }
        }
      }
      jqajax.ajax(ajaxObj)
    })
  },
  dependentFromProject: {
    datasources: true,
    entities: true,
    questions: true
  },
  translateRoute(route) {
    return (route in api.dependentFromProject ? 'projects/' + api.projectId + '/' + route : route)
  },
  arrayToObject: function (toTransform, akey) {
    if (typeof toTransform === Array) {
      akey = akey || 'id'
      return toTransform.reduce(function (acc, cur, i) {
        acc[cur[akey]] = cur
        return acc
      }, {})
    } else {
      return toTransform
    }
  },
  setToken: function (token) {
    this.token = token
  },
  setProjectId: function (projectId) {
    api.projectId = projectId
  }
}

export default api
