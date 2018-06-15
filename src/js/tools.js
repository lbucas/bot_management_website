export default {
  cookies: {
    get: function(sName) {
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
    set: function(sName, sValue) {
      var oDate = new Date()
      oDate.setYear(oDate.getFullYear() + 1)
      var sCookie = encodeURIComponent(sName) + '=' + encodeURIComponent(sValue) + ';expires=' + oDate.toGMTString() + ';path=/'
      document.cookie = sCookie
    },
    clear: function(sName) {
      this.set(sName, '')
    }
  },
  removeFromArray(list, toDelete) {
    return list.filter(item => item != toDelete) // eslint-disable-line eqeqeq
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
  objectToArray(obj) {
    let a = []
    for (let key in obj) {
      a.push(obj[key])
    }
    return a
  }
}
