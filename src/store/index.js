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
    projects: {},
    datasources: {},
    entities: {},
    intents: {},
    joins: {},
    datasourcetypes: {},
    charttypes: {},
    test: 1

  },
  getters: {
    tables: state => {
      return {}
    },
    attributes: state => {
      return {}
    }
  },
  mutations: {
    updateItem(state, {toUpdate, data}) {
      debugger
      for (let oldKey in state[toUpdate]) {
        if (!(oldKey in data)) {
          Vue.delete(state[toUpdate], oldKey)
        }
      }
      for (let newKey in data) {
        Vue.set(state[toUpdate], newKey, data[newKey])
      }
    }

  },
  actions: {
    load(context, toLoad) {
      return new Promise(function (resolve, reject) {
        if (typeof toLoad === String) {
          toLoad = [toLoad]
        }
        let updating = []
        for (let loadItem of toLoad) {
          if (Object.keys(context.state[loadItem]).length === 0) {
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
      return new Promise(function (resolve, reject) {
        let filter = (filters[toLoad] ? {'filter': filters[toLoad]} : {})
        api.get(toLoad, filter)
          .then((data) => {
            context.commit('updateItem', {toUpdate: toLoad, data: data})
            resolve()
          }, (err) => {
            reject(err)
          })
      })
    },
    create(context, {route, toPost}) {
      return new Promise(function (resolve, reject) {
        api.call('POST', route, toPost)
          .then((data) => {
            context.dispatch('update', route)
              .then(() => {
                resolve(data.id)
              }, (err) => {
                reject(err)
              })
          })
      })
    },
    edit(context, {route, toPost}) {
      return new Promise(function (resolve, reject) {
        route = route + '/' + toPost.id
        api.call('PATCH', route, toPost)
          .then((data) => {
            context.dispatch('update', route)
              .then(() => {
                resolve(data.id)
              }, (err) => {
                reject(err)
              })
          })
      })
    },
    delete(context, {route, toDelete}) {
      return new Promise(function (resolve, reject) {
        route = route + '/' + toDelete
        api.call('DELETE', route)
          .then((data) => {
            context.dispatch('update', route)
              .then(() => {
                resolve(data.id)
              }, (err) => {
                reject(err)
              })
          })
      })
    },
    authenticate() {

    }
  }
})
