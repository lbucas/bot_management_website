/**
 * This is the most important file of the project as it serves as central point for loading, storing and manipulating
 * the dashboards data. The technology used is Vuex ("Vue store") which is the official state management implemtation
 * for state management for the Vue.js framework.
 *
 * The store is initialized with an object containing 4 properties:
 * -state: Defines the data which are in the store and which is used all over the application. Data here can be accessed
 *    inside components via 'this.$store.state.<property>". It is the equivalent of the data option inside components.
 * -getters: Defines values which are computed using the data in the stored in the state. It is reactive to changes in
 *    the latter. The computed data can be accessed via 'this.$store.getters.<property>" inside components. It is the
 *    equivalent of the 'computed' option.
 * -mutations: Defines functions to manipulate the data in the store. Best practice is to only use mutations to change
 *    the state data (opposed to directly changing it inside the components) as it provides better maintainability and
 *    comprehensibility in large applications. These functions can be accessed triggered via
 *    'this.$store.commit('<mutationName>", <parameters>)'.
 * -actions: Defines functions which run asynchronous code. It is mainly used a central interface for the api in this
 *    application. Functions can be triggered via 'this.$store.dispatch('<mutationName>", <parameters>)'.
 * */

import Vuex from 'vuex'
import Vue from 'vue'
import api from './api' // custom API wrapper
import Promise from 'bluebird'
import tools from './tools'
import urlConf from './urlConfig'

Vue.use(Vuex)

/**
 * Helper function to set an object in the way that Vue is reacting to the changes reliably
 * @param oldItem Object
 * @param newItem Object
 */
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
/**
 * Similar to clone, but property which are non-existent in the new object are not deleted from the old item
 * @param oldItem
 * @param newItem
 */
const update = (oldItem, newItem) => {
  for (let newKey in newItem) {
    if (newItem[newKey] !== undefined) {
      Vue.set(oldItem, newKey, newItem[newKey])
    }
  }
}
const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Stores the loopback filter parameters that are used in GET requests for the specified routes.
 */
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
/**
 * Stores validation functions for specified routes by the model key. If true is given as value, the default validation
 * function will be applied, which checks if the value is specified or if has atleast one value in the case of an array.
 * Validation functions should return true if the validation succeeded and false if not. Alternatively a string value can
 * be returned, if there are multiple possibilities for failed validations. The hints which are associated with the should
 * be provided in the language files with the key 'validation-<route>.<modelkey>' or
 * 'validation-<route>.<modelkey>-<identifier>'. The validation can receive the following as function properties:
 * The current value of the validation target, the whole detail item for the current route, state, getters.
 */
const validations = {
  databases: {
    name: true,
    databaseTypeId: true,
    "connectionObj.host": true,
    "connectionObj.port"(v) {
      return !(!v || isNaN(v))
    },
    "connectionObj.db": true,
    "connectionObj.user": true,
    "connectionObj.password": true
  },
  entities: {
    name: true,
    description: true,
    attributeId: true
  },
  intents: {
    name: true,
    targetValueIds(v) {
      if (!v) return false
      return (v.length > 0 && v.indexOf(null) === -1)
    },
    aggregationId: true,
    charttypeId: true,
    groupById(v, detailItem, state, getters) {
      return !(!v) ||
        (detailItem.targetValueLength > 1 && detailItem.calculationNeeded) ||
        detailItem.charttypeId == getters.charttypeTable
    },
    fixedFilter(v) {
      for (let i in v) {
        try {
          if (v[i].filters.length === 0) return false
        } catch (e) {
          if (v[i].length === 0) return false
        }
      }
      return true
    }
  }
}

let excelDatasourceId = null
let flatfileDatasourceId = null

let notificationTries = 0
let sse

// The store is initialized here
export default new Vuex.Store({
  state: {
    apiUrl: api.url(),
    /* This section contains objects similar to the routes in the api */
    projects: {},
    projectId: '',
    databases: {},
    datasources: {},
    excelFiles: {},
    entities: {},
    flatfiles: {},
    intents: {},
    joins: {},
    databasetypes: {},
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
    /* Reference to api and tools for use in components */
    api: api,
    tools: tools,
    /* The detail items are used when route objects are edited or created by the user. Using this, changes by the user
    can easily be reverted */
    detailItem: {
      databases: {
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
        attributeId: null
      },
      intents: {
        name: "",
        charttypeId: "",
        calculationNeeded: null,
        id: null,
        targetValueIds: [],
        groupById: null,
        filterByIds: [],
        aggregationId: null,
        fixedFilter: {}
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
      flatfiles: {
        name: "",
        location: "",
        eTag: "",
        bucket: "",
        key: "",
        projectId: 0,
        datasourceId: 0
      },
      botUsers: {
        MUID: '',
        role: ''
      },
      keywords: {},
      trainings: {}
    },
    /* Blueprints of every route object which are copied to the detail item when the user wants to create a new item */
    newItem: {
      databases: {
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
        calculationNeeded: null,
        id: null,
        targetValueIds: [null],
        groupById: null,
        filterByIds: [],
        aggregationId: null,
        projectId: null,
        fixedFilter: {}
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
      },
      flatfiles: {
        name: "",
        location: "",
        eTag: "",
        bucket: "",
        key: "",
        projectId: 0,
        datasourceId: 0
      },
      botUsers: {
        MUID: '',
        role: 'Standard'
      }
    },
    onEdit: {
      databases: false,
      entities: false,
      intents: false,
      excelFiles: false,
      flatfiles: false,
      botUsers: false
    },
    /* This values specify if the data has been loaded already in order to prevent redundant requsts */
    loaded: {
      projects: false,
      databases: false,
      entities: false,
      intents: false,
      joins: false,
      databasestypes: false,
      user: false,
      charttypes: false,
      excelFiles: false,
      flatfiles: false
    },
    /* This values specify if request linked to this route is in progress in order to display visual loading
    indicators */
    loaders: {
      projects: false,
      databases: false,
      entities: false,
      intents: false,
      joins: false,
      excelFiles: false,
      flatfiles: false,
      botUsers: false,
      bots: false,
      keywords: {},
      trainings: {}
    },
    /* This values specify if the detail section of the MasterDetail component is displayed for each route that uses
    it */
    detailsVisible: {
      databases: false,
      entities: false,
      intents: false,
      joins: false,
      excelFiles: false,
      botUsers: false
    },
    /* A copy of each notification is stored here */
    notifications: {},
    /* All parts of the ui which have to be translated are stored here and are loaded dynamically based on the language
    selection */
    lang: {},
    selectedLang: '',
    /* Information concerning the bot deployment and usable bots */
    bot: {},
    bots: {},
    /* This section contains help values which are used to display values in pages and to load them in stages */
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
    entriesPerPage: 10,
    keywordName: {},
    /* Specifies if the validation hints are visible per route */
    validationsVisible: {
      databases: false,
      entities: false,
      intents: false,
      botUsers: false
    },
    /* Stores errors emitted by the API */
    error: {}
  },
  getters: {
    /* Calculates the tables as an object with ids as keys based on the datasources object */
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
    /* Calculates the attributes as an object with ids as keys based on the tables object */
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
    /* Adds metainformation to the joins (Datasource, Table, Attribute for both joined attributes) for easier
     in the components */
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
    /* Computes which tables are joined per table */
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
    /* Executes the validation checks for each validation specified and loads the associated hint */
    validationErrors: (state, getters) => {
      let start = new Date().getTime()
      let ve = {}
      for (let route in validations) {
        if (state.onEdit[route]) {
          let l = state.lang['validation-' + route]
          let checks = validations[route]
          let errors = {}
          for (let target in checks) {
            let checkFunction = checks[target]
            if (checkFunction === true) {
              checkFunction = v => {
                if (Array.isArray(v)) return (v.length > 0)
                return !(!(v))
              }
            }
            let checkResult = checkFunction(state.tools.deepValue(state.detailItem[route], target),
              state.detailItem[route], state, getters)
            if (typeof checkResult === 'string') {
              errors[target] = l[`${target}-${checkResult}`]
              continue
            }
            if (!checkResult) errors[target] = l[target]
          }
          ve[route] = errors
        } else {
          ve[route] = {}
        }
      }
      console.log(new Date().getTime() - start)
      return ve
    },
    savable: (state, getters) => {
      let s = {}
      for (let route in validations) {
        s[route] = Object.keys(getters.validationErrors[route]).length === 0
      }
      return s
    },
    /* Computes which tables belong to an excel file */
    tablesPerExcel: state => {
      if (!excelDatasourceId) {
        let found = false
        for (let id in state.datasources) {
          let ds = state.datasources[id]
          if (ds.name === "Excel Files") {
            excelDatasourceId = id
            found = true
            break
          }
        }
        if (!found) return {}
      }
      let excelDs = state.datasources[excelDatasourceId]
      let tpe = {}
      for (let tid in excelDs.tables) {
        let t = excelDs.tables[tid]
        tpe[t.excelFileId] = tpe[t.excelFileId] || {}
        tpe[t.excelFileId][tid] = t
      }
      return tpe
    },
    /* Computes the id of the charttype with the name table for easier access in the components */
    charttypeTable: state => {
      for (let ctk in state.charttypes) {
        if (state.charttypes[ctk].name === 'Table') return ctk
      }
      return null
    },
    /* Computes which table belongs to a flat file */
    tablesPerFlatfile: state => {
      if (!flatfileDatasourceId) {
        let found = false
        for (let id in state.datasources) {
          let ds = state.datasources[id]
          if (ds.name === "Flat Files") {
            flatfileDatasourceId = id
            found = true
            break
          }
        }
        if (!found) return {}
      }
      let flatfileDs = state.datasources[flatfileDatasourceId]
      let tpf = {}
      for (let tid in flatfileDs.tables) {
        let t = flatfileDs.tables[tid]
        tpf[t.flatfileId] = {}
        tpf[t.flatfileId][tid] = t
      }
      return tpf
    },
    /* Retrieves the users from the bot object */
    botUsers: state => {
      try {
        let userArr = state.projects[state.projectId].botUserIds
        let users = {}
        for (let user of userArr) {
          users[user] = {
            id: user,
            name: user,
            role: 'Standard'
          }
        }
        return users
      } catch (e) {
        return {}
      }
    },
    /* Calculates which role the user has per project, can be owner or member */
    rolePerProject: state => {
      let rpp = {}
      for (let projectId in state.projects) {
        let project = state.projects[projectId]
        let l = state.lang.global
        let ownUserId = state.user.user.id
        let role = project.merckUserId === ownUserId ? l.owner : l.member
        rpp[projectId] = role
      }
      return rpp
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
        state.loaders[route] = state.loaders[route] || {}
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
      Vue.set(state.detailsVisible, route, false)
      setTimeout(() => { // to allow the animation
        Vue.set(state.detailsVisible, route, true)
      }, 20)
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
    clearKeywordDetail(state, attributeId) {
      Vue.set(this.state.detailItem.keywords, attributeId, {})
      Vue.set(this.state.keywordName, attributeId, '')
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
    },
    setLang(state, {lang, name}) {
      state.selectedLang = name
      for (let view in lang) {
        if (!state.lang[view]) {
          Vue.set(state.lang, view, {})
        }
        for (let sentence in lang[view]) {
          Vue.set(state.lang[view], sentence, lang[view][sentence])
        }
      }
    },
    setBotcontainer(state, bot) {
      clone(state.bot, bot)
    },
    setOwnBots(state, bots) {
      bots = tools.objectToArray(bots)
      update(state.bots, bots)
    },
    setValidationsVisible(state, route) {
      state.validationsVisible[route] = true
    },
    hideValidations(state, route) {
      state.validationsVisible[route] = false
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
    async update(context, toLoad) {
      if (typeof toLoad === 'string') {
        toLoad = {
          route: toLoad,
          target: toLoad
        }
      }
      let activeId
      try {
        activeId = context.state.detailItem[toLoad.target].id
      } catch (e) {
      }
      context.commit('loading', toLoad.route)
      let filter = (filters[toLoad.route] ? {'filter': filters[toLoad.route]} : {})
      let data = await api.get(toLoad.route, filter)
      context.commit('updateItem', {toUpdate: toLoad.target, data: data})
      if (activeId) {
        context.commit('setDetailItem', {route: toLoad.target, item: context.state[toLoad.target][activeId]})
      }
      context.commit('finishedLoading', toLoad.route)
    },
    updateProjectDependent(context) {
      for (let item in context.state.loaded) {
        if (context.state.loaded[item] && api.dependentFromProject[item]) {
          context.dispatch('update', item)
        }
      }
    },
    async create(context, {route, toCreate}) {
      if (toCreate.id) delete toCreate.id
      if (toCreate.projectId) toCreate.projectId = context.state.api.projectId
      context.commit('loading', route)
      let data = await api.call('POST', route, toCreate)
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
      return data
    },
    async patch(context, {route, toPatch}) {
      context.commit('loading', route)
      let patchRoute = route + '/' + toPatch.id
      let data = await api.call('PATCH', patchRoute, toPatch)
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
      return data
    },
    async delete(context, {route, toDelete}) {
      context.commit('loading', route)
      let deleteRoute = route + '/' + toDelete
      await api.call('DELETE', deleteRoute)
      context.commit('delete', {route, item: toDelete})
      context.commit('setDetailsNotVisible', route)
      context.commit('finishedLoading', route)
    },
    async post(context, {route, toPost}) {
      return await api.call('POST', route, toPost)
    },
    async patchReq(context, {route, toPatch}) {
      return await api.call('PATCH', route, toPatch)
    },
    async get(context, {route, data}) {
      return await api.call('GET', route, data)
    },
    async getRouteSpecific(context, {subroute, id, forceReload}) {
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
      } else {
        context.commit('finishedLoading', {route: subroute, valId: id})
      }
    },
    async getNextLoadLimited(context, {subroute, id}) {
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
      let data = await api.call('GET', route, {filter: filter})
      data = api.arrayToObject(data)
      context.commit('setRouteSpecific', {subroute, id, data})
      context.commit('finishedLoading', {route: subroute, valId: id})
      return (data)
    },
    async getKeywordsFromDs(context, {attributeId, entityId}) {
      context.commit('loading', {route: 'keywords', valId: attributeId})
      await api.call("POST", 'attributeValues/updateValues', {
        attributeId,
        entityId,
        projectId: context.state.projectId
      })
      context.commit('finishedLoading', {route: 'keywords', valId: attributeId})
    },
    setAccessToken(context, token) {
      api.setToken(token)
    },
    setProjectId(context, projectId) {
      context.commit('setProjectId', projectId)
      api.setProjectId(projectId)
    },
    newDetailItem(context, route) {
      let item = JSON.parse(JSON.stringify(context.state.newItem[route]))
      context.commit('setDetailItem', {route, item})
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
    async createPagination(context, {subroute, id}) {
      context.commit('createPagination', {subroute, id})
      await context.dispatch('calculateOnPage', {subroute, id})
    },
    calculateOnPage(context, {subroute, id}) {
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
    async notificationStream(context, notify) {
      sse = await api.serverSentEvent('notifications/startNotifications')
      sse.addEventListener('data', async event => {
        let d = JSON.parse(event.data)
        d.data.timestamp = new Date().getDate()
        let item = tools.arrayToObject([d.data])
        let msg = await context.dispatch('notificationHandler', {message: d.data.message, ctx: d.data.context})
        notify({
          group: 'all',
          title: msg.title,
          text: msg.detail
        })
        context.commit('set', {route: 'notifications', item})
      })
      sse.onerror = async (e, stream) => {
        if (e) {
          sse.close()
          // If an error occurs and the stream stops, there will be 5 attempts to restart it
          await timeout(3000)
          notificationTries++
          if (notificationTries < 6) context.dispatch('notificationStream', notify)
        }
      }
    },
    notificationHandler(context, {message, ctx}) {
      let l = context.state.lang.notifications
      switch (message) {
        case 'GLUE_JOB_DONE': {
          context.dispatch('update', 'datasources')
          return {
            title: l.schemaBuilt,
            detail: `${l.filename} ${ctx.value}`
          }
        }
        case 'GLUE_JOB_STARTED': {
          return {
            title: l.schemaBuildStarted,
            detail: `${l.filename} ${ctx.value}`
          }
        }
        case 'BOT_DEPLOY_STARTED': {
          return {
            title: l.deploymentInProgess,
            detail: l.deploymentInProgessMsg
          }
        }
        case 'BOT_DEPLOY_DONE': {
          let b = {}
          clone(b, context.state.bot)
          b.deploying = false
          context.commit('setBotcontainer', b)
          return {
            title: l.deploymentDone,
            detail: l.deploymentDoneMsg
          }
        }
      }
    },
    async unlinkKeyword(context, attributeId) {
      this.commit('loading', 'entities')
      let detailItem = context.state.detailItem.keywords[attributeId]
      let keywordId = detailItem[Object.keys(detailItem)[0]].id
      await context.dispatch('post', {
        route: 'keywords/unlinkKeywords',
        toPost: {keywordId}
      })
      await context.dispatch('getRouteSpecific', {subroute: 'keywords', id: attributeId, forceReload: true})
      this.commit('clearKeywordDetail', attributeId)
      this.commit('finishedLoading', 'entities')
    },
    async summarizeKeyword(context, attributeId) {
      this.commit('loading', 'entities')
      let detailItem = context.state.detailItem.keywords[attributeId]
      let keywordIds = Object.keys(detailItem)
      await context.dispatch('post', {
        route: 'keywords/linkKeywords',
        toPost: {
          keywordIds: Object.keys(detailItem),
          newName: context.state.keywordName[attributeId] || detailItem[keywordIds[0]].name
        }
      })
      await context.dispatch('getRouteSpecific', {subroute: 'keywords', id: attributeId, forceReload: true})
      this.commit('clearKeywordDetail', attributeId)
      this.commit('finishedLoading', 'entities')
    },
    async saveTraining(context, {intentId, patch}) {
      context.commit('loading', {route: 'trainings', valId: intentId})
      let mode = (patch ? 'PATCH' : 'POST')
      let d = context.state.detailItem.trainings[intentId]
      let route = (patch ? 'trainings/' + d.id : 'trainings')
      await api.call(mode, route, d)
      await context.dispatch('getRouteSpecific', {subroute: 'trainings', id: intentId, forceReload: true})
      context.commit('finishedLoading', {route: 'trainings', valId: intentId})
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
    errorHandling(context, {err, route, data, router}) {
      if (err.response && err.response.status === 401 && urlConf.lookup[window.location.hostname] === 'prod') {
        router.push('/signin')
      } else {
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
    },
    async checkDeploymentState(context) {
      let pid = await api.waitforProjectId()
      let bot = await api.call('GET', 'botcontainers', {
        filter: {
          where: {
            projectId: pid
          }
        }
      })
      if (bot.length > 0) context.commit('setBotcontainer', bot[0])
    },
    async deployBot(context) {
      context.commit('setBotcontainer', {deploying: true}) // to make sure the button is locked, even if the request takes longer
      let bot = await api.call('POST', 'botcontainers/createContainer', {
        projectId: context.state.projectId,
        currentUser: context.state.user.user.id
      })
      context.commit('setBotcontainer', bot.success)
    },
    async getOwnBots(context) {
      context.commit('loading', 'bots')
      let bots = await api.call('GET', 'projects/getBotsPerUser')
      context.commit('setOwnBots', bots)
      context.commit('finishedLoading', 'bots')
    }
  }
})
