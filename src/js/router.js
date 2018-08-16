import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Botselection from '@/views/Botselection'
import Datasources from '@/views/datasources/Datasources'
import Questions from '@/views/questions/Questions'
import Connections from '@/views/connections/Connections'
import Entities from '@/views/entities/Entities'
import Settings from '@/views/Settings'
import Users from '@/views/Users'
import Signin from '@/views/signin/SignIn'
import Signedin from '@/views/signin/SignedIn'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Databots',
      component: Botselection
    },
    {
      path: '/admin',
      name: 'Home',
      component: Home
    },
    {
      path: '/admin/questions',
      name: 'Questions',
      component: Questions
    },
    {
      path: '/admin/connections',
      name: 'Connections',
      component: Connections
    },
    {
      path: '/admin/entities',
      name: 'Entities',
      component: Entities
    },
    {
      path: '/admin/settings',
      name: 'Settings',
      component: Settings
    },
    {
      path: '/admin/users',
      name: 'Users',
      component: Users
    },
    {
      path: '/admin/datasources',
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
