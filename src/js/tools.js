import Vue from 'vue'

export default {
  store: null,
  cookies: {
    get: function (sName) {
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
    set: function (sName, sValue) {
      var oDate = new Date()
      oDate.setYear(oDate.getFullYear() + 1)
      var sCookie = encodeURIComponent(sName) + '=' + encodeURIComponent(sValue) + ';expires=' + oDate.toGMTString() + ';path=/'
      document.cookie = sCookie
    },
    clear: function (sName) {
      this.set(sName, '')
    }
  },
  removeFromArray(list, toDelete) {
    return list.filter(item => item != toDelete) // eslint-disable-line eqeqeq
  },
  arrayToObject(toTransform, akey) {
    if (Array.isArray(toTransform)) {
      let isStringArray = false
      if (typeof toTransform[0] === 'string') {
        isStringArray = true
      } else {
        akey = akey || 'id'
      }
      return toTransform.reduce((acc, cur) => {
        if (isStringArray) {
          acc[cur] = {name: cur}
        } else {
          acc[cur[akey]] = cur
        }
        return acc
      }, {})
    } else {
      return toTransform
    }
  },
  objectToArray(obj) {
    let a = []
    for (let key in obj) {
      a.push(obj[key])
    }
    return a
  },
  clone(toSet, toClone) {
    for (var k in toClone) Vue.set(toSet, k, toClone[k])
    for (var s in toSet) {
      if (!(s in toClone)) {
        Vue.delete(toSet, s)
      }
    }
  },
  deepValue(obj, path) {
    if (obj && path) {
      for (let p of path.split('.')) {
        obj = obj[p]
      }
      return obj
    }
    return undefined
  },
  arrayIndexOf(arr, key, value) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][key] == value) return i // eslint-disable-line eqeqeq
    }
    return -1
  },
  attributeFullName(id) {
    try {
      let g = this.store.getters
      let attr = g.attributes[id]
      let table = g.tables[attr.tableId]
      return `${this.store.state.datasources[table.datasourceId].name}-${table.name}-${attr.name}`
    } catch (e) {
      return ''
    }
  }
}
