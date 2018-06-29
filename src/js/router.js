import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Datasources from '@/views/Datasources'
import Questions from '@/views/questions/Questions'
import Connections from '@/views/connections/Connections'
import Entities from '@/views/entities/Entities'
import Settings from '@/views/Settings'
import Users from '@/views/Users'
import Signin from '@/views/SignIn'
import Signedin from '@/views/SignedIn'

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
      name: 'Questions',
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
      name: 'Signin',
      component: Signin
    },
    {
      path: '/signedin',
      name: 'Signedin',
      component: Signedin
    }
  ]
})
