<template>
  <b-container fluid id="app">
    <b-row>
      <b-col md="3" lg="2" id="sidenavigation" v-if="!$root.signingIn">
        <b-row>
          <b-col>
            <div id="logoDiv">
              <img id="emdlogo" src="./assets/logo/emdgreen.png">
            </div>
          </b-col>
        </b-row>
        <h5>Bot Management</h5>
        <h6 id="projectTitle" @click="$root.projectDialog"><img src="./assets/icons/projects.svg" id="projectIcon"/>
          {{$root.project.name}}</h6>
        <div id="links">
          <ul v-for="nl in navLinks">
            <li class="navLink font-weight-light" @click="route(nl)" :active="current === nl">
              <img v-bind:src="(require('./assets/icons/'+nl+'.svg'))" class="navIcon"/>
              {{nl}}
            </li>
          </ul>
        </div>

      </b-col>
      <b-col id="mainCol">
        <b-row id="nav-info" class="shadow">
          <b-col id="currentPage" class="text-left">
            <h4>{{current}}</h4>
          </b-col>
          <b-col id="userInfo" class="text-right">
            {{userDisplayName}}
          </b-col>
        </b-row>
        <div id="routerContent">
          <transition name="component-fade" mode="out-in">
            <router-view/>
          </transition>
        </div>
      </b-col>
    </b-row>

    <b-modal size="lg" id="projectModal" title="Choose your project" cancel-disabled no-close-on-esc
             no-close-on-backdrop
             hide-header-close ok-disabled>
      <div class="table-responsive">
        <Loader :loading="projectsLoading"/>
        <table class="table table-hover">
          <thead>
          <th>Title</th>
          <th>Your Role</th>
          </thead>
          <tbody>
          <tr v-for="p in projects" @click="chooseProject(p)">
            <td>{{p.name}}</td>
            <td>{{p.role}}</td>
          </tr>
          <tr v-if="createProject">
            <td>
              <div class="form-group">
                <input v-model="newProjectName" placeholder="Provide a name for the project" class="form-control">
              </div>
            </td>
            <td>
              <b-button variant="primary" id="saveProject" @click="saveProject">Save</b-button>
            </td>
          </tr>
          </tbody>
        </table>
        <b-button variant="primary" class="cpButton" @click="createProject=true" v-if="!createProject">Create a
          project
        </b-button>
        <b-button variant="secondary" class="cpButton" @click="createProject=false" v-if="createProject">Cancel
        </b-button>
      </div>
    </b-modal>

    <div id="flaticon">Icons made by <a href="https://www.flaticon.com/authors/smashicons"
                                        title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/"
                                                                                  title="Flaticon">www.flaticon.com</a>
      is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0"
                        target="_blank">CC 3.0 BY</a></div>

  </b-container>
</template>

<script>
  import Loader from "./components/Loader"

  export default {
    name: 'app',
    components: {Loader},
    data() {
      return {
        current: 'Home',
        user: {
          firstname: '',
          lastname: ''
        },
        navLinks: [
          'Datasources',
          'Connections',
          'Entities',
          'Questions',
          'Users',
          'Settings'
        ],
        projects: {},
        createProject: false,
        newProjectName: '',
        projectsLoading: '',
        datasources: {}
      }
    },
    computed: {
      userDisplayName() {
        return this.user.firstname + ' ' + this.user.lastname
      }
    },
    methods: {
      route(togo) {
        var cur = togo
        if (cur === '/') {
          cur = "Home"
        }
        this.current = cur
        togo = togo.toLowerCase()
        this.$router.push('/' + togo)
      },
      chooseProject(p) {
        this.$root.modalClose('projectModal')
        this.$root.project = p
        this.route('/')
        this.$root.setCookie('project', JSON.stringify(p))
        this.$root.post(
          'projects/changeProject',
          {projectId: p.id}
        )
      },
      loadProjects() {
        var t = this
        t.$root.getAndSet(
          'projects',
          t.projects,
          function (p) {
            for (var id in p) {
              p[id].role = 'Creator'
            }
            return p
          },
          function () {
            t.projectsLoading = false
          }
        )
      },
      saveProject() {
        var t = this
        var project = {
          name: t.newProjectName,
          merckUserId: t.user.id
        }
        t.projectsLoading = true
        t.$root.post(
          'projects',
          project,
          function (p) {
            t.$set(t.projects, p.id, p)
            t.createProject = false
            t.projectsLoading = false
          }
        )
      },
      getUser() {
        var t = this
        if (t.user.lastname === '') {
          this.$root.getAndSet(
            'merckUsers/whoAmI',
            t.user,
            function (d) {
              return d.user
            }
          )
        }
      },
      getDatasources() {
        var t = this
        t.connectionLoading = true
        this.$root.getAndSet(
          'projects/--projectid--/datasources',
          t.datasources,
          function (data) {
            for (var k in data) {
              data[k].tables = t.$root.arrayToObject(data[k].tables)
              for (var id in data[k].tables) {
                data[k].tables[id].datasourceId = k
                data[k].tables[id].x = Math.floor(Math.random() * Math.floor(600))
                data[k].tables[id].y = Math.floor(Math.random() * Math.floor(500))
                data[k].tables[id].visible = false
                data[k].tables[id].attributes = t.$root.arrayToObject(data[k].tables[id].attributes)
              }
            }
            return data
          },
          function () {},
          {
            filter: '{"include":{"relation":"tables","scope":{"include":[{"relation":"joins","scope":{"include":{"relation":"attributes","scope":{"fields":["id","tableId"]}}}},{"relation":"attributes"}]}}}'
          }
        )
      }
    },
    created() {
      debugger
      if (!this.$root.getCookie('signingIn')) {
        this.$root.checkSigninAndProject()
        this.loadProjects()
        this.getUser()
        this.current = this.$router.history.current.name
        this.getDatasources()
      }
    }
  }
</script>

<style lang="less">
  // Variables for Merck CI;
  @import "assets/less/colors";
  @import "assets/less/mixins";

  // global settings
  #app {
    font-family: @font, 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    background: @background;
  }

  html {
    @media (min-width: 576px) {
      overflow: hidden;
    }
  }

  // wrapper
  #sidenavigation {
    background: @richPurple;
    height: 100vh;
    color: white;
    z-index: 1;
    #noUserSelect
  }

  #nav-info {
    height: 3em;
  }

  #emdlogo {
    max-width: 75%;
    padding: 1em;
  }

  #flaticon {
    display: none;
  }

  .navIcon {
    width: 1.3em;
  }

  #links {
    margin-top: 7vh;
    ul {
      list-style-type: none;
      padding-left: 1em;
    }
    li {
      text-align: left;
      font-size: 1em;
      cursor: pointer;
      transition: font-size 300ms;
      &[active] {
        font-size: 1.1em;
      }
    }
    li:hover {
      font-size: 1.1em;
    }

  }

  .modal-body {
    text-align: left;
  }

  .modal-header {
    text-align: center;
  }

  #projectIcon {
    width: .8em;
  }

  #projectModal {
    .modal-footer {
      display: none;
    }
    th {
      border-top: none;
    }
    tr {
      cursor: pointer;
    }
  }

  #projectTitle {
    cursor: pointer;
  }

  #nav-info {
    background: @richPurple;
    color: white;
    border-bottom: 2px solid @richPurple;
    padding-top: .5em;
    z-index: 3;
  }

  #routerContent {
    text-align: left;
    height: 93vh;
    overflow-y: auto;
    padding-right: 2em;
    padding-left: 1em;
  }

  #mainCol {
    padding: 0;
  }

  #userInfo {
    margin-right: 1em;
  }

  .btn {
    float: right;
    margin-left: .5em;
    margin-bottom: 1em;
    display: inline-block;
  }

  //tabs
  .nav-item a {
    color: black !important;
  }

  //icons
  .controlicon {
    width: 1em;
  }

  //transitions
  .component-fade-enter-active, .component-fade-leave-active {
    transition: opacity .2s ease;
  }

  .component-fade-enter, .component-fade-leave-to
    /* .component-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .cpButton {
    margin: 5px;
  }

  #saveProject {
    float: left;
  }


</style>
