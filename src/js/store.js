import Vuex from 'vuex'
import Vue from 'vue'
import api from './api'
import Promise from 'bluebird'
import tools from './tools'

Vue.use(Vuex)

const filters = {
  datasources: {
    "include": {
      "relation": "tables",
      "scope": {
        "include": [{
          "relation": "joins",
          "scope": {"include": {"relation": "attributes", "scope": {"fields": ["id", "tableId"]}}}
        }, {"relation": "attributes"}]
      }
    }
  },
  keywords: {
    "include": "attributeValues"
  }
}
const clone = (oldItem, newItem) => {
  for (let oldKey in oldItem) {
    if (!(oldKey in newItem)) {
      Vue.delete(oldItem, oldKey)
    }
  }
  for (let newKey in newItem) {
    Vue.set(oldItem, newKey, newItem[newKey])
  }
}
const update = (oldItem, newItem) => {
  for (let newKey in newItem) {
    if (newItem[newKey] !== undefined) {
      Vue.set(oldItem, newKey, newItem[newKey])
    }
  }
}

export default new Vuex.Store({
  state: {
    apiUrl: api.url(),
    projects: {},
    projectId: '',
    datasources: {},
    excelFiles: {},
    entities: {},
    intents: {},
    joins: {},
    datasourcetypes: {},
    user: {
      user: {
        firstname: '',
        lastname: ''
      }
    },
    charttypes: {},
    aggregations: {},
    keywords: {},
    trainings: {},
    api: api,
    tools: tools,
    detailItem: {
      datasources: {
        name: '',
        datasourceTypeId: "",
        connectionObj: {
          host: "",
          db: "",
          user: "",
          password: "",
          port: ""
        },
        tables: []
      },
      entities: {
        id: null,
        name: '',
        description: '',
        attributeId: null,
        onEdit: false
      },
      intents: {
        name: "",
        charttypeId: "",
        calculationNeeded: false,
        id: null,
        targetValueId: null,
        groupById: null,
        filterByIds: [],
        aggregationId: null
      },
      joins: {
        table1: {
          id: '',
          name: ''
        },
        table2: {
          id: '',
          name: ''
        },
        editjoin: {
          id1: "none",
          id2: "none",
          id: ''
        }
      },
      excelFiles: {
        name: "",
        location: "",
        eTag: "",
        bucket: "",
        key: "",
        projectId: 0,
        datasourceId: 0
      },
      keywords: {},
      trainings: {}
    },
    newItem: {
      datasources: {
        id: null,
        name: '',
        datasourceTypeId: 1,
        connectionObj: {
          host: '',
          user: '',
          password: '',
          port: '',
          db: ''
        }
      },
      entities: {
        id: null,
        name: '',
        description: '',
        attributeId: null
      },
      intents: {
        name: "",
        charttypeId: null,
        calculationNeeded: false,
        id: null,
        targetValueId: null,
        groupById: null,
        filterByIds: [],
        aggregationId: null,
        projectId: null
      },
      training: {
        sentence: '',
        id: this.intentId,
        _annotations: []
      },
      excelFiles: {
        name: "",
        location: "",
        eTag: "",
        bucket: "",
        key: "",
        projectId: 0,
        datasourceId: 0
      }
    },
    errorChecks: {
      datasources: {},
      entities: {
        name: 'Please provide a title for the entity',
        description: 'Please provide a description for the entity',
        attributeId: 'Please select a connected attribute'
      },
      intents: {
        name: 'Please provide a title for the question',
        targetValueId: 'Please provide a target value for the question',
        aggregationId: 'Please select an aggregation method for the question',
        charttypeId: "Please select a charttype for the visulization of the question's results",
        groupById: 'Please select an entity by which the results will be grouped by'
      }
    },
    onEdit: {
      datasources: false,
      entities: false,
      intents: false,
      excelFiles: false
    },
    loaded: {
      projects: false,
      datasources: false,
      entities: false,
      intents: false,
      joins: false,
      datasourcetypes: false,
      user: false,
      charttypes: false,
      excelFiles: false
    },
    loaders: {
      projects: false,
      datasources: false,
      entities: false,
      intents: false,
      joins: false,
      excelFiles: false,
      keywords: {},
      trainings: {}
    },
    detailsVisible: {
      datasources: false,
      entities: false,
      intents: false,
      joins: false,
      excelFiles: false
    },
    // subroute specific
    onPage: {
      keywords: {},
      trainings: {}
    },
    loadLimitedCount: {
      keywords: {},
      trainings: {}
    },
    loadLimitedIndex: {
      keywords: {},
      trainings: {}
    },
    page: {
      keywords: {},
      trainings: {}
    },
    loadlimit: 100,
    entriesPerPage: 12,
    keywordName: {},
    error: {}

  },
  getters: {
    tables: state => {
      let tables = {}
      for (let dsid in state.datasources) {
        let ds = state.datasources[dsid]
        for (let tid in ds.tables) {
          tables[tid] = ds.tables[tid]
          tables[tid].datasourceId = dsid
        }
      }
      return tables
    },
    attributes: state => {
      let attr = {}
      for (let dsid in state.datasources) {
        let ds = ds = state.datasources[dsid]
        for (let tid in ds.tables) {
          let table = ds.tables[tid]
          for (let attrId in table.attributes) {
            attr[attrId] = table.attributes[attrId]
            attr[attrId].datasourceId = dsid
            attr[attrId].tableId = tid
          }
        }
      }
      return attr
    },
    joinsExtended: (state, getters) => {
      let je = {}
      let joins = state.joins
      let attr = getters.attributes
      let j, join, a1, a2
      for (let jid in joins) {
        j = joins[jid]
        a1 = attr[j.attributeIds[0]]
        a2 = attr[j.attributeIds[1]]
        if (a1 && a2) {
          je[j.id] = {
            t1: a1.tableId,
            t2: a2.tableId,
            d1: a1.datasourceId,
            d2: a2.datasourceId,
            a1: a1.id,
            a2: a2.id,
            id: j.id
          }
        }
      }
      return je
    },
    joinsPerTable: (state, getters) => {
      let jpt = {}
      let joins = getters.joinsExtended
      let attr = getters.attributes
      let join, a1, a2
      for (let jid in joins) {
        join = joins[jid]
        if (!jpt[join.t1]) {
          jpt[join.t1] = {}
        }
        if (!jpt[join.t2]) {
          jpt[join.t2] = {}
        }
        let jSwapped = {
          t1: join.t2,
          t2: join.t1,
          d1: join.d2,
          d2: join.d1,
          a1: join.a2,
          a2: join.a1,
          id: join.id
        }
        jpt[join.t1][join.t2] = join
        jpt[join.t2][join.t1] = jSwapped
      }
      return jpt
    },
    validationErrors: state => {
      let ve = {}
      for (let route in state.errorChecks) {
        if (state.onEdit[route]) {
          let checks = state.errorChecks[route]
          let errors = {}
          for (let target in checks) {
            let checkObj = checks[target]
            if (typeof checkObj === 'string') {
              checkObj = {
                msg: checkObj,
                check(v) {
                  if (Array.isArray(v)) return (v.length > 0)
                  return !(!(v))
                }
              }
            }
            let checkResult = checkObj.check(state.tools.deepValue(state.detailItem[route], target))
            if (checkResult === false) {
              errors[target] = checkObj.msg
              continue
            }
            if (typeof checkResult === 'string') {
              errors[target] = checkObj.msg[checkResult]
            }
          }
          ve[route] = errors
        } else {
          ve[route] = {}
        }
      }
      return ve
    }
  },
  mutations: {
    updateItem(state, {toUpdate, data}) {
      clone(state[toUpdate], data)
      state.loaded[toUpdate] = true
    },
    updateDetailItem(state, {route, key, value}) {
      let targetObj = state.detailItem[route]
      key = key.split('.')
      let l = key.length
      for (let i = 0; i < l - 1; i++) targetObj = targetObj[key[i]]
      Vue.set(targetObj, key[l - 1], value)
    },
    loading(state, route) {
      if (typeof route === 'string') {
        Vue.set(state.loaders, route, true)
      } else {
        let valId = route.valId
        route = route.route
        Vue.set(state.loaders[route], valId, true)
      }
    },
    finishedLoading(state, route) {
      if (typeof route === 'string') {
        Vue.set(state.loaders, route, false)
      } else {
        let valId = route.valId
        route = route.route
        Vue.set(state.loaders[route], valId, false)
      }
    },
    set(state, {route, item}) {
      update(state[route], item)
    },
    setDetailItem(state, {route, item}) {
      let toUpdate = state.detailItem[route]
      clone(toUpdate, item)
    },
    setRouteSpecific(state, {subroute, id, data}) {
      let list = state[subroute][id]
      if (!list) {
        Vue.set(state[subroute], id, {})
        list = state[subroute][id]
      }
      update(state[subroute][id], data)
      Vue.set(state.loadLimitedIndex[subroute], id, Object.keys(state[subroute][id]))
    },
    clearRouteSpecific(state, {subroute, id}) {
      Vue.delete(state[subroute], id)
      Vue.delete(state.loadLimitedIndex[subroute], id)
    },
    patch(state, {route, item}) {
      Vue.set(state[route], item.id, item)
    },
    delete(state, {route, item}) {
      Vue.delete(state[route], item)
    },
    editing(state, route) {
      Vue.set(state.onEdit, route, true)
    },
    endEditing(state, route) {
      Vue.set(state.onEdit, route, false)
    },
    setProjectId(state, projectId) {
      state.projectId = projectId
      for (let r in state.detailsVisible) state.detailsVisible[r] = false
    },
    setDetailsVisible(state, route) {
      Vue.set(state.detailsVisible, route, false) // to allow the animation
      setTimeout(() => {
        Vue.set(state.detailsVisible, route, true)
      }, 10)
    },
    setDetailsNotVisible(state, route) {
      Vue.set(state.detailsVisible, route, false)
    },
    setLoadLimitedCount(state, {subroute, id, count}) {
      Vue.set(state.loadLimitedCount[subroute], id, count)
    },
    setOnPage(state, {subroute, id, onPage}) {
      state.onPage[subroute][id] = {}
      update(state.onPage[subroute][id], onPage)
    },
    createPagination(state, {subroute, id}) {
      Vue.set(state.page[subroute], id, 1)
      Vue.set(state.onPage[subroute], id, {})
    },
    page(state, {subroute, id, page}) {
      state.page[subroute][id] = page
    },
    keywordSelected(state, {attrId, keyword}) {
      let id = keyword.id
      let sel = this.state.detailItem.keywords[attrId]
      if (!sel) {
        Vue.set(this.state.detailItem.keywords, attrId, {})
        Vue.set(this.state.keywordName, attrId, '')
        sel = this.state.detailItem.keywords[attrId]
      }
      (id in sel) ? Vue.delete(sel, id) : Vue.set(sel, id, keyword)
    },
    clearKeywordSelected(state, {attrId}) {
      Vue.set(this.state.detailItem.keywords, attrId, {})
    },
    keywordName(state, {newValue, attrId}) {
      Vue.set(this.state.keywordName, attrId, newValue)
    },
    trainingSelected(state, {intentId, training}) {
      let t = state.detailItem.trainings[intentId]
      if (!t) {
        Vue.set(state.detailItem.trainings, intentId, {})
        t = state.detailItem.trainings[intentId]
      }
      for (let newKey in training) {
        if (training[newKey] !== undefined) Vue.set(t, newKey, training[newKey])
      }
    },
    newTraining(state, intentId) {
      let newTr = {
        intentId: intentId,
        sentence: '',
        projectId: state.projectId,
        _annotations: []
      }
      Vue.set(state.detailItem.trainings, intentId, newTr)
    },
    error(state, error) {
      Vue.set(state, 'error', error)
    }
  },
  actions: {
    load(context, toLoad) {
      return new Promise(function (resolve, reject) {
        if (typeof toLoad === 'string' || !(Array.isArray(toLoad))) {
          toLoad = [toLoad]
        }
        let updating = []
        let customTarget = null
        for (let loadItem of toLoad) {
          if (typeof loadItem === 'string') {
            loadItem = {
              route: loadItem,
              target: loadItem
            }
          }
          if (!(context.state.loaded[loadItem.target])) {
            updating.push(context.dispatch('update', loadItem))
          }
        }
        Promise.all(updating)
          .then(() => {
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    update(context, toLoad) {
      if (typeof toLoad === 'string') {
        toLoad = {
          route: toLoad,
          target: toLoad
        }
      }
      var activeId
      try {
        activeId = context.state.detailItem[toLoad.target].id
      } catch (e) {
      }
      context.commit('loading', toLoad.route)
      return new Promise(function (resolve, reject) {
        let filter = (filters[toLoad.route] ? {'filter': filters[toLoad.route]} : {})
        api.get(toLoad.route, filter)
          .then((data) => {
            context.commit('updateItem', {toUpdate: toLoad.target, data: data})
            if (activeId) {
              context.commit('setDetailItem', {route: toLoad.target, item: context.state[toLoad.target][activeId]})
            }
            context.commit('finishedLoading', toLoad.route)
            resolve()
          }, (err) => {
            reject(err)
          })
      })
    },
    updateProjectDependent(context) {
      for (let item in context.state.loaded) {
        if (context.state.loaded[item]) {
          if (api.dependentFromProject[item]) {
            context.dispatch('update', item)
          }
        }
      }
    },
    create(context, {route, toCreate}) {
      delete toCreate.id
      context.commit('loading', route)
      return new Promise(function (resolve, reject) {
        api.call('POST', route, toCreate)
          .then((data) => {
            if (data.id) {
              let temp = {}
              temp[data.id] = data
              data = temp
            }
            let callback = api.getCallbacks[route]
            if (callback) {
              data = callback(data)
            }
            context.commit('set', {route, item: data})
            context.commit('endEditing', route)
            if (route in context.state.detailItem) {
              context.commit('setDetailItem', {route, item: data[Object.keys(data)[0]]})
            }
            context.commit('finishedLoading', route)
            resolve(data)
          }, (err) => {
            reject(err)
          })
      })
    },
    patch(context, {route, toPatch}) {
      context.commit('loading', route)
      return new Promise(function (resolve, reject) {
        let patchRoute = route + '/' + toPatch.id
        api.call('PATCH', patchRoute, toPatch)
          .then((data) => {
            if (data.id) {
              let temp = {}
              temp[data.id] = data
              data = temp
            }
            let callback = api.getCallbacks[route]
            if (callback) {
              data = callback(data)
            }
            context.commit('set', {route, item: data})
            context.commit('endEditing', route)
            if (route in context.state.detailItem) {
              context.commit('setDetailItem', {route, item: data[Object.keys(data)[0]]})
            }
            context.commit('finishedLoading', route)
            resolve(data)
          }, (err) => {
            reject(err)
          })
      })
    },
    delete(context, {route, toDelete}) {
      context.commit('loading', route)
      return new Promise(function (resolve, reject) {
        let deleteRoute = route + '/' + toDelete
        api.call('DELETE', deleteRoute)
          .then(() => {
            context.commit('delete', {route, item: toDelete})
            context.commit('setDetailsNotVisible', route)
            context.commit('finishedLoading', route)
            resolve()
          }, (err) => {
            reject(err)
          })
      })
    },
    post(context, {route, toPost}) {
      return new Promise(function (resolve, reject) {
        api.call('POST', route, toPost)
          .then((data) => {
            resolve(data)
          }, (err) => {
            reject(err)
          })
      })
    },
    get(context, {route, filter}) {
      return new Promise(function (resolve, reject) {
        api.call('GET', route, filter)
          .then((data) => {
            resolve(data)
          }, (err) => {
            reject(err)
          })
      })
    },
    getRouteSpecific(context, {subroute, id, forceReload}) {
      return new Promise(async function (resolve, reject) {
        context.commit('loading', {route: subroute, valId: id})
        if (forceReload) {
          context.commit('clearRouteSpecific', {subroute, id})
        }
        let list = context.state[subroute][id]
        if (!(list) || list.length === 0) {
          let route = api.getSubroute(subroute, id) + '/count'
          let d = await api.call('GET', route)
          context.commit('setLoadLimitedCount', {subroute, id, count: d.count})
          await context.dispatch('getNextLoadLimited', {subroute, id})
          await context.dispatch('createPagination', {subroute, id})
          context.commit('finishedLoading', {route: subroute, valId: id})
          resolve()
        } else {
          context.commit('finishedLoading', {route: subroute, valId: id})
          resolve()
        }
      })
    },
    getNextLoadLimited(context, {subroute, id}) {
      return new Promise(function (resolve, reject) {
        let alreadyLoaded
        try {
          alreadyLoaded = context.state.loadLimitedIndex[subroute][id].length
        } catch (e) {
          alreadyLoaded = 0
        }
        let nextLimit = alreadyLoaded + context.state.loadlimit
        let filter = filters[subroute] || {}
        filter.limit = nextLimit
        filter.skip = alreadyLoaded
        let route = api.getSubroute(subroute, id)
        api.call('GET', route, {filter: filter})
          .then((data) => {
            data = api.arrayToObject(data)
            context.commit('setRouteSpecific', {subroute, id, data})
            context.commit('finishedLoading', {route: subroute, valId: id})
            resolve(data)
          }, (err) => {
            reject(err)
          })
      })
    },
    getKeywordsFromDs(context, {attributeId, entityId}) {
      return new Promise(function (resolve, reject) {
        context.commit('loading', {route: 'keywords', valId: attributeId})
        api.call("POST", 'attributeValues/updateValues', {attributeId, entityId})
          .then(() => {
            context.commit('finishedLoading', {route: 'keywords', valId: attributeId})
            resolve()
          }, (err) => {
            reject(err)
          })
      })
    },
    setAccessToken(context, token) {
      api.setToken(token)
    },
    setProjectId(context, projectId) {
      context.commit('setProjectId', projectId)
      api.setProjectId(projectId)
    },
    newDetailItem(context, route) {
      context.commit('setDetailItem', {route, item: context.state.newItem[route]})
    },
    setBackEditing(context, route) {
      let id = context.state.detailItem[route].id
      if (id) {
        context.commit('setDetailItem', {route, item: context.state[route][id]})
        context.commit('endEditing', route)
      } else {
        context.commit('setDetailItem', {route, item: context.state.newItem[route]})
      }
    },
    createPagination(context, {subroute, id}) {
      return new Promise(function (resolve, reject) {
        context.commit('createPagination', {subroute, id})
        context.dispatch('calculateOnPage', {subroute, id})
          .then(() => {
            resolve()
          })
      })
    },
    calculateOnPage(context, {subroute, id}) {
      return new Promise(function (resolve, reject) {
        let page = context.state.page[subroute][id]
        let epp = context.state.entriesPerPage
        let max = Math.min(page * epp, context.state.loadLimitedCount[subroute][id])
        let op = {}
        let list = context.state[subroute][id]
        let index = context.state.loadLimitedIndex[subroute][id]
        let next
        for (let i = (page - 1) * epp; i < max; i++) {
          next = list[index[i]]
          op[next.id] = next
        }
        context.commit('setOnPage', {subroute, id, onPage: op})
      })
    },
    page(context, {subroute, id, forward}) {
      let toAdd = (forward ? 1 : -1)
      let newPage = context.state.page[subroute][id] + toAdd
      let epp = context.state.entriesPerPage
      let alreadyLoaded = context.state[subroute][id].length
      if ((alreadyLoaded - newPage * epp) / context.state.loadlimit < 0.5) {
        context.dispatch('getNextLoadLimited', {subroute, id})
      }
      context.commit('page', {subroute, id, page: newPage})
      context.dispatch('calculateOnPage', {subroute, id})
    },
    notificationStream(context) {

    },
    updateKeyword(context, attributeId) {
      // TODO
    },
    summarizeKeyword(context, attributeId) {
      // TODO
    },
    saveTraining(context, {intentId, patch}) {
      return new Promise(async function (resolve, reject) {
        context.commit('loading', {route: 'trainings', valId: intentId})
        let mode = (patch ? 'PATCH' : 'POST')
        let d = context.state.detailItem.trainings[intentId]
        let route = (patch ? 'trainings/' + d.id : 'trainings')
        await api.call(mode, route, d)
        await context.dispatch('getRouteSpecific', {subroute: 'trainings', id: intentId, forceReload: true})
        context.commit('loading', {route: 'finishedLoading', valId: intentId})
        resolve()
      })
    },
    deleteTraining(context, intentId) {
      return new Promise(async function (resolve, reject) {
        context.commit('loading', {route: 'trainings', valId: intentId})
        let id = context.state.detailItem.trainings[intentId].id
        await api.call('DELETE', 'trainings/' + id)
        await context.dispatch('getRouteSpecific', {subroute: 'trainings', id: intentId, forceReload: true})
        context.commit('loading', {route: 'finishedLoading', valId: intentId})
        resolve()
      })
    },
    errorHandling(context, {err, route, data}) {
      let errMsg
      try {
        errMsg = err.response.data.error.message
      } catch (e) {
        errMsg = err.message
      }
      let error = {
        route,
        sentData: JSON.stringify(data),
        message: errMsg,
        status: err.request.status + ' ' + err.request.statusText,
        full: err
      }
      context.commit('error', error)
      context.commit('finishedLoading', route.split('/')[0])
    }
  }
})
