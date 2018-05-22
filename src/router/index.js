import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/views/dashboard'
import Datasources from '@/views/datasources'
import Intents from '@/views/intents'
import Entities from '@/views/entities'
import Settings from '@/views/settings'
import Users from '@/views/users'
import SignIn from '@/views/SignIn'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/intents',
      name: 'Intents',
      component: Intents
    },
    {
      path: '/entities',
      name: 'Entities',
      component: Entities
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    },
    {
      path: '/users',
      name: 'Users',
      component: Users
    },
    {
      path: '/datasources',
      name: 'Datasources',
      component: Datasources
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn
    }
  ]
})
