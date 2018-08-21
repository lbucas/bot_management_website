import axios from 'axios'
import Promise from 'bluebird'
import urlConf from './urlConfig'

const mainUrl = 'https://api.emd-databots.com/'
const devUrl = 'https://dev.emd-databots.com/'

const api = {
  token: null,
  projectId: null,
  mode: null,
  url() {
    let mode = this.mode || urlConf.lookup[window.location.hostname]
    return urlConf.api[mode]
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
  get(route, data) {
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
        api.queue.push({args, resolve, reject, type: 'call'})
      }
    })
  },
  dependentFromProject: {
    databases: true,
    datasources: true,
    entities: true,
    intents: true,
    excelFiles: true,
    flatfiles: true,
    bot: true,
    joins: true
  },
  fireCall({type, route, data}) {
    return new Promise((resolve, reject) => {
      data = data || {}
      let params = {
        access_token: api.token
      }
      let url = api.url() + api.translateRoute(route, type)
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
  translateRoute(route, type) {
    if (route === 'projects' && type === 'GET') return 'projects/getOwnProjects' // Projects route requires special treatment
    // If the requested route is connected to a project the route project/{projectId}/{requestedRoute} is used
    return (route in api.dependentFromProject ? 'projects/' + api.projectId + '/' + route : route)
  },
  checkDependencies(route) {
    return (api.token && (!api.dependentFromProject[route] || api.projectId))
  },
  queue: [],
  flushQueue() {
    let call, args
    for (let i = 0; i < this.queue.length; i++) {
      call = this.queue.pop()
      args = call.args
      if (call.type === 'call') {
        this.call(args.type, args.route, args.data)
          .then((data) => {
            call.resolve(data)
          }, (err) => {
            call.reject(err)
          })
      } else {
        this.serverSentEvent(args.route)
          .then((sse) => {
            call.resolve(sse)
          }, (err) => {
            call.reject(err)
          })
      }
    }
  },
  notifyQueue: [],
  waitforProjectId() {
    return new Promise((resolve, reject) => {
      if (api.projectId) resolve(api.projectId)
      api.notifyQueue.push(resolve)
    })
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
    for (let resolve of api.notifyQueue) resolve(projectId)
  },
  setErrorHandler(handler) {
    api.errorHandler = handler
  },
  serverSentEvent(route) {
    return new Promise(function (resolve, reject) {
      if (api.checkDependencies(route)) {
        resolve(new EventSource(`${api.url()}${route}?access_token=${api.token}`))
      } else {
        let args = {route}
        api.queue.push({args, resolve, reject, type: 'sse'})
      }
    })
  }
}

export default api
