import Vuex from 'vuex'
import Vue from 'vue'
import api from '../api'
import Promise from 'bluebird'

Vue.use(Vuex)

const filters = {
  datasources: '{"include":{"relation":"tables","scope":{"include":[{"relation":"joins","scope":{"include":{"relation":"attributes","scope":{"fields":["id","tableId"]}}}},{"relation":"attributes"}]}}}'
}

export default new Vuex.Store({
  state: {
    apiUrl: api.url(),
    projects: {},
    datasources: {},
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
    api: api,
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
        id: '',
        name: '',
        description: '',
        attributeId: '',
        onEdit: false
      }
    },
    newItem: {
      datasources: {
        id: '',
        name: '',
        datasourceTypeId: '5b0435bc41b70a008681ddc7',
        connectionObj: {
          host: '',
          user: '',
          password: '',
          port: '',
          db: ''
        }
      },
      entities: {
        id: '',
        name: '',
        description: '',
        attributeId: '',
        onEdit: false
      }
    },
    onEdit: {
      datasources: false,
      entities: false
    },
    loaded: {
      projects: false,
      datasources: false,
      entities: false,
      intents: false,
      joins: false,
      datasourcetypes: false,
      user: false,
      charttypes: false
    },
    loaders: {
      projects: false,
      datasources: false,
      entities: false,
      intents: false,
      joins: false,
      keywords: false
    }

  },
  getters: {
    tables: state => {
      var tables = {}
      let ds
      for (let dsid in state.datasources) {
        ds = state.datasources[dsid]
        for (let tid in ds.tables) {
          tables[tid] = ds.tables[tid]
          tables[tid].datasourceId = dsid
        }
      }
      return tables
    },
    attributes: state => {
      var attr = {}
      let ds, table
      for (let dsid in state.datasources) {
        ds = state.datasources[dsid]
        for (let tid in ds.tables) {
          table = ds.tables[tid]
          for (let attrId in table.attributes) {
            attr[attrId] = table.attributes[attrId]
            attr[attrId].datasourceId = dsid
            attr[attrId].tableId = tid
          }
          attr[tid] = ds.tables[tid]
          attr[tid].datasourceId = dsid
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
        jpt[join.t1][join.td] = join
        jpt[join.t2][join.t1] = jSwapped
      }
      return jpt
    }
  },
  mutations: {
    updateItem(state, {toUpdate, data}) {
      for (let oldKey in state[toUpdate]) {
        if (!(oldKey in data)) {
          Vue.delete(state[toUpdate], oldKey)
        }
      }
      for (let newKey in data) {
        Vue.set(state[toUpdate], newKey, data[newKey])
      }
      state.loaded[toUpdate] = true
    },
    loading(state, route) {
      state.loaders[route] = true
    },
    finishedLoading(state, route) {
      state.loaders[route] = false
    },
    setKeywords(state, {keywords, attributeId}) {
      state.keywords[attributeId] = keywords
    },
    setDetailItem(state, {route, item}) {
      let toUpdate = state.detailItem[route]
      for (let newKey in item) {
        if (item[newKey] !== undefined) {
          Vue.set(toUpdate, newKey, item[newKey])
        }
      }
    },
    set(state, {route, items}) {
      for (let key in items) {
        Vue.set(state[route], key, items.id)
      }
    },
    patch(state, {route, item}) {
      Vue.set(state[route], item.id, item)
    },
    delete(state, {route, id}) {
      Vue.delete(state[route], id)
    },
    editing(state, route) {
      this.state.onEdit[route] = true
    },
    endEditing(state, route) {
      this.state.onEdit[route] = false
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
      } catch (e) {}
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
            context.commit('setDetailItem', {route, item: data[Object.keys(data)[0]]})
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
            context.commit('setDetailItem', {route, item: data[Object.keys(data)[0]]})
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
    getKeywords(context, {attributeId, forceReload}) {
      return new Promise(function (resolve, reject) {
        this.commit('loading', 'keywords')
        let keywords = context.state.keywords[attributeId]
        if (!keywords || forceReload) {
          let route = 'attributes/' + attributeId + '/attributeValues'
          api.call('GET', route)
            .then((data) => {
              data = api.arrayToObject(data)
              context.commit('setKeywords', {keywords, attributeId})
              this.commit('finishedLoading', 'keywords')
              resolve(data)
            }, (err) => {
              reject(err)
            })
        } else {
          this.commit('finishedLoading', 'keywords')
          resolve(keywords)
        }
      })
    },
    setAccessToken(context, token) {
      api.setToken(token)
    },
    setProjectId(context, projectId) {
      api.setProjectId(projectId)
    },
    newDetailItem(context, route) {
      context.commit('setDetailItem', {route, item: context.state.newItem[route]})
    },
    setBackEditing(context, route) {
      let id = context.state.detailItem[route].id
      debugger
      if (id) {
        context.commit('setDetailItem', {route, item: context.state[route][id]})
        context.commit('endEditing', route)
      } else {
        context.commit('setDetailItem', {route, item: context.state.newItem[route]})
      }
    }
  }
})
