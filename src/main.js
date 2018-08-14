// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './js/router'
import store from './js/store'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import tools from './js/tools'
import VueClip from 'vue-clip'
import VueNotification from 'vue-notification'
// global components
import Save from "./components/buttons/SaveButton"
import Cancel from "./components/buttons/CancelButton"
import Edit from "./components/buttons/EditButton"
import Delete from "./components/buttons/DeleteButton"
import MasterDetail from './components/MasterDetail'
import FrInput from "./components/form/FormRowInput"
import FrBlank from "./components/form/FormRowBlank"
import FrSelect from "./components/form/FormRowSelect"
import FrDisplay from "./components/form/FormRowDisplay"
import FrAttributeSelect from "./components/form/FormRowAttributeSelect"
import FrArrayInput from "./components/form/FormRowArrayInput"
import CustomForm from "./components/form/CustomForm"
import Loader from "./components/Loader"
import Icon from "./components/Icon"
import Update from "./components/buttons/UpdateButton"

Vue.use(BootstrapVue)
Vue.use(VueClip)
Vue.use(VueNotification)

let toSnake = s => {
  let upperChars = s.match(/([A-Z])/g)
  if (!upperChars) {
    return s
  }
  let str = s.toString()
  for (let i = 0, n = upperChars.length; i < n; i++) {
    str = str.replace(
      new RegExp(upperChars[i]), '-' + upperChars[i].toLowerCase(),
    )
  }
  if (str.slice(0, 1) === '-') {
    str = str.slice(1)
  }
  return str
}

let components = {
  Save,
  Cancel,
  Edit,
  Delete,
  MasterDetail,
  FrBlank,
  FrInput,
  FrAttributeSelect,
  FrArrayInput,
  FrSelect,
  FrDisplay,
  CustomForm,
  Loader,
  Icon,
  Update
}
for (let key in components) Vue.component(toSnake(key), components[key])

Vue.config.productionTip = false
Vue.prototype.$tools = tools

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App},
  created() {
    let t = this
    t.$store.state.api.setErrorHandler((err, route, data) => {
      t.$store.dispatch('errorHandling', {err, route, data, router: t.$router})
    })
    t.$tools.store = t.$store
    let langPreference = tools.cookies.get('langPreference') || 'DE'
    t.$store.commit('setLang', {lang: t.$tools.lang(langPreference), name: langPreference})
  },
  methods: {
    modalOpen(id) {
      this.$emit('bv::show::modal', id)
    },
    modalClose(id) {
      this.$emit('bv::hide::modal', id)
    }
  },
  computed: {
    l() {
      return this.$store.state.lang.global
    }
  }
})
