import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home'
import Datasources from '@/views/datasources'
import Questions from '@/views/questions'
import Connections from '@/views/connections'
import Entities from '@/views/entities'
import Settings from '@/views/settings'
import Users from '@/views/users'
import SignIn from '@/views/signIn'
import SignedIn from '@/views/signedIn'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/questions',
      name: 'Qeustions',
      component: Questions
    },
    {
      path: '/connections',
      name: 'Connections',
      component: Connections
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
    },
    {
      path: '/signedin',
      name: 'SignedIn',
      component: SignedIn
    }
  ]
})
