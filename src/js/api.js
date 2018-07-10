import axios from 'axios'
import Promise from 'bluebird'

const mainUrl = 'https://api.emd-databots.com/'
const devUrl = 'https://dev.emd-databots.com/'

const api = {
  token: null,
  projectId: null,
  url() {
    return (window.location.hostname === 'webdev.emd-databots.com' ? devUrl : mainUrl)
  },
  getCallbacks: {
    datasources(data) {
      for (var k in data) {
        data[k].tables = api.arrayToObject(data[k].tables)
        for (var id in data[k].tables) {
          data[k].tables[id].datasourceId = k
          data[k].tables[id].x = Math.floor(Math.random() * Math.floor(600))
          data[k].tables[id].y = Math.floor(Math.random() * Math.floor(500))
          data[k].tables[id].visible = false
          for (var aid in data[k].tables[id].attributes) {
            data[k].tables[id].attributes = api.arrayToObject(data[k].tables[id].attributes)
          }
        }
      }
      return data
    },
    intents(data) {
      let intent
      for (var k in data) {
        intent = data[k]
        intent.groupById = intent.groupById[0]
      }
      return data
    }
  },
  errorHandler() {
  },
  getSubroute(route, id) {
    switch (route) {
      case 'keywords':
        return 'attributes/' + id + '/keywords'
      case 'trainings':
        return 'intents/' + id + '/trainings'
    }
  },
  get (route, data) {
    return new Promise(function (resolve, reject) {
      api.call('GET', route, data)
        .then((data) => {
          data = api.arrayToObject(data)
          if (api.getCallbacks[route]) {
            data = api.getCallbacks[route](data)
          }
          resolve(data)
        }, (err) => {
          reject(err)
        })
    })
  },
  call(type, route, data) {
    var args = {route: route, type: type, data: data}
    return new Promise(function (resolve, reject) {
      if (api.checkDependencies(route)) {
        api.fireCall(args)
          .then((data) => {
            resolve(data)
          }, (err) => {
            reject(err)
          })
      } else {
        api.queue.push({args, resolve, reject})
      }
    })
  },
  dependentFromProject: {
    datasources: true,
    entities: true,
    intents: true,
    excelFiles: true
  },
  fireCall({type, route, data}) {
    return new Promise(function (resolve, reject) {
      data = data || {}
      let params = {
        accessToken: api.token
      }
      let url = api.url() + api.translateRoute(route)
      if (type === 'GET' && data) {
        for (let key in data) params[key] = data[key]
      }
      axios({url, method: type, data, params})
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          api.errorHandler(err, route, data)
        })
    })
  },
  translateRoute(route) {
    return (route in api.dependentFromProject ? 'projects/' + api.projectId + '/' + route : route)
  },
  checkDependencies(route) {
    if (api.token && (!api.dependentFromProject[route] || api.projectId)) {
      return true
    } else {
      return false
    }
  },
  queue: [],
  flushQueue() {
    let call, args
    for (let i = 0; i < this.queue.length; i++) {
      call = this.queue[i]
      args = call.args
      this.call(args.type, args.route, args.data)
        .then((data) => {
          call.resolve(data)
        }, (err) => {
          call.reject(err)
        })
    }
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
  setToken(token) {
    this.token = token
    this.flushQueue()
  },
  setProjectId(projectId) {
    api.projectId = projectId
    this.flushQueue()
  },
  setErrorHandler(handler) {
    api.errorHandler = handler
  }
}

export default api
