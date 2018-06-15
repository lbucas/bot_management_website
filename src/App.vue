<template>
  <b-container fluid id="app">
    <b-row>
      <b-col md="3" lg="2" id="sidenavigation" v-if="!signingIn">
        <b-row>
          <b-col>
            <div id="logoDiv">
              <img id="emdlogo" src="./assets/logo/emdgreen.png">
            </div>
          </b-col>
        </b-row>
        <h5>Bot Management</h5>
        <h6 id="projectTitle" @click=" $root.modalOpen('projectModal')">
          <icon id="projectIcon" icon="Projects"/>
          {{project.name}}
        </h6>
        <div id="links">
          <ul v-for="nl in navLinks">
            <li class="navLink font-weight-light" @click="route(nl)" :active="current === nl">
              <icon :icon="nl" class="navIcon"/>
              {{nl}}
            </li>
          </ul>
        </div>

      </b-col>
      <b-col id="mainCol">
        <b-row id="nav-info" class="shadow" v-if="!signingIn">
          <b-col id="currentPage" class="text-left">
            <h4>
              <icon :icon="current"/>
              {{current}}
            </h4>
          </b-col>
          <b-col id="userInfo" class="text-right">
            <icon icon="Notification"/>
            {{userDisplayName}}
          </b-col>
        </b-row>
        <div id="routerContent">
          <transition name="component-fade" mode="out-in">
            <keep-alive>
              <router-view/>
            </keep-alive>
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
          <tr v-for="p in projects" @click="chooseProject(p, true)">
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
  import Icon from "./components/Icon"

  export default {
    name: 'app',
    components: {Icon, Loader},
    data() {
      return {
        current: 'Home',
        navLinks: [
          'Datasources',
          'Connections',
          'Entities',
          'Questions',
          'Users',
          'Settings'
        ],
        project: {
          name: ''
        },
        createProject: false,
        newProjectName: '',
        datasources: {}
      }
    },
    computed: {
      userDisplayName() {
        return this.user.firstname + ' ' + this.user.lastname
      },
      projects() {
        return this.$store.state.projects
      },
      user() {
        return this.$store.state.user.user
      },
      projectsLoading() {
        return this.$store.state.loaders.projects
      },
      signingIn() {
        return this.$store.state.signingIn
      }
    },
    methods: {
      route(togo) {
        togo = togo.toLowerCase()
        this.$router.push('/' + togo)
      },
      projectCheck() {
        this.loadProjects()
        let p = this.$tools.cookies.get('project')
        if (p) {
          p = JSON.parse(p)
          this.chooseProject(p)
        }
      },
      chooseProject(p, onModal) {
        this.project = p
        this.$store.dispatch('setProjectId', p.id)
        this.$tools.cookies.set('project', JSON.stringify(p))
        if (onModal) {
          this.$root.modalClose('projectModal')
        }
        this.$store.dispatch('post', {route: 'projects/changeProject', toPost: {projectId: p.id}})
        this.$store.dispatch('updateProjectDependent')
      },
      loadProjects() {
        var t = this
        this.$store.dispatch('load', ['projects'])
      },
      saveProject() {
        var t = this
        var project = {
          name: t.newProjectName,
          merckUserId: t.user.id
        }
        this.$store.dispatch('create', {route: 'projects', toCreate: project})
          .then(() => {
            t.createProject = false
          })
      },
      getUser() {
        this.$store.dispatch('load', {route: 'merckUsers/whoAmI', target: 'user'})
      }
    },
    created() {
      this.current = this.$router.history.current.name
      let at = this.$tools.cookies.get('access_token')
      let expires = this.$tools.cookies.get('access_token_validUntil')
      let today = new Date()
      if (at && parseInt(expires) > new Date().getTime()) {
        this.$store.dispatch('setAccessToken', at)
        this.projectCheck()
        this.getUser()
      } else {
        this.$store.commit('signingIn')
        if (!(this.current === 'Signin' || this.current === 'Signedin')) {
          this.route('Signin')
        }
      }
    },
    mounted() {
      if (!this.project.id && !this.signingIn) {
        this.$root.modalOpen('projectModal')
      }
    },
    watch: {
      $route (to) {
        this.current = to.name
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
    width: 1.3em !important;
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
