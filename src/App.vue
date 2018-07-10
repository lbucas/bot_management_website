<template>
  <b-container fluid id="app">
    <b-row>
      <b-col md="3" lg="2" id="sidenavigation" v-if="!onSignIn">
        <b-row>
          <b-col>
            <div id="logoDiv">
              <img id="emdlogo" src="./assets/logo/merckgreen.png">
            </div>
          </b-col>
        </b-row>
        <h5>Bot Management</h5>
        <h6 class="projectTitle" @click=" $root.modalOpen('projectModal')">
          <icon class="projectIcon" icon="Projects"/>
          {{project.name}}
        </h6>
        <div class="links">
          <ul v-for="nl in navLinks">
            <li class="navLink font-weight-light" @click="route(navLinkKeys[nl] || nl)"
                :active="$route.name === (navLinkKeys[nl] || nl)">
              <icon :icon="navLinkKeys[nl] || nl" class="navIcon"/>
              {{nl}}
            </li>
          </ul>
        </div>

      </b-col>
      <b-col id="mainCol">
        <b-row id="nav-info" class="shadow" v-if="!onSignIn">
          <b-col id="currentPage" class="text-left">
            <h4>
              <icon id="currentPageIcon" :icon="navLinkKeys[$route.name] || $route.name"/>
              {{$route.name}}
            </h4>
          </b-col>
          <b-col id="userInfo" class="text-right">
            <icon icon="Notification"/>
            {{userDisplayName}}
          </b-col>
          <b-col id="mobileMenuIconCol" class="text-right">
            <div @click="mobileMenuOpen = !mobileMenuOpen">
              <Icon id="mobileMenuIcon" icon="menu"/>
            </div>
          </b-col>
        </b-row>
        <transition name="fade">
          <div id="mobileMenu" v-if="mobileMenuOpen">
            <h6>{{userDisplayName}}</h6>
            <h6 class="projectTitleMobile" @click=" $root.modalOpen('projectModal')">
              <icon class="projectIcon" icon="Projects"/>
              {{project.name}}
            </h6>
            <div class="links">
              <ul v-for="nl in navLinks">
                <li class="navLink font-weight-light" @click="route(navLinkKeys[nl] || nl); mobileMenuOpen = false"
                    :active="$route.name === (navLinkKeys[nl] || nl)">
                  <icon :icon="navLinkKeys[nl] || nl" class="navIcon"/>
                  {{nl}}
                </li>
              </ul>
            </div>
          </div>
        </transition>
        <div id="routerContent">
          <transition name="view" mode="out-in">
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

    <b-modal id="errorModal" title="An Error occurred" cancel-disabled>
      <h6>It seems like an error occurred within the application:</h6>
      <br>
      <error-display :src="error.status" desc="Type"/>
      <error-display :src="error.message" desc="Message"/>
      <error-display :src="error.route" desc="Target"/>
      <error-display :src="error.sentData" desc="Sent Data"/>
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
  import ErrorDisplay from "./components/ErrorDisplay"

  export default {
    name: 'app',
    components: {ErrorDisplay, Icon, Loader},
    data() {
      return {
        navLinks: [
          'Datasources',
          'Connections',
          'Entities',
          'Questions',
          'Users',
          'Settings'
        ],
        navLinkKeys: {},
        project: {
          name: ''
        },
        createProject: false,
        newProjectName: '',
        datasources: {},
        mobileMenuOpen: false
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
      error() {
        return this.$store.state.error
      },
      onSignIn() {
        return this.$route.name === 'Signin' || this.$route.name === 'Signedin'
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
        } else {
          this.$root.modalOpen('projectModal')
        }
      },
      chooseProject(p, onModal) {
        this.project = p
        this.$store.dispatch('setProjectId', p.id)
        this.$tools.cookies.set('project', JSON.stringify(p))
        if (onModal) this.$root.modalClose('projectModal')
        this.$store.dispatch('updateProjectDependent')
      },
      loadProjects() {
        this.$store.dispatch('load', ['projects'])
      },
      async saveProject() {
        let project = {
          name: this.newProjectName,
          merckUserId: this.user.id
        }
        await this.$store.dispatch('create', {route: 'projects', toCreate: project})
        this.createProject = false
      },
      getUser() {
        this.$store.dispatch('load', {route: 'merckUsers/whoAmI', target: 'user'})
      }
    },
    created() {
      if (this.$route.name === 'Signin' || this.$route.name === 'Signedin') {
        this.$store.commit('signingIn')
      } else {
        let at = this.$tools.cookies.get('access_token')
        let expires = this.$tools.cookies.get('access_token_validUntil')
        let today = new Date()
        if (at && parseInt(expires) > new Date().getTime()) {
          this.$store.dispatch('setAccessToken', at)
          this.projectCheck()
          this.getUser()
        } else {
          this.$router.push('/signin')
        }
      }
    },
    mounted() {
      if (!this.onSignIn) this.projectCheck()
    },
    watch: {
      error() {
        this.$root.modalOpen('errorModal')
      }
    }
  }
</script>

<style lang="less">
  // Variables for Merck CI;
  @import "assets/less/colors";
  @import "assets/less/mixins";
  @import "assets/less/transitions";

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

  @media (max-width: 768px) {
    #sidenavigation {
      display: none;
    }

    #userInfo {
      display: none;
    }
  }

  @media (min-width: 768.1px) {
    #mobileMenu {
      display: none;
    }

    #mobileMenuIconCol {
      display: none;
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
    padding: 0 1rem 0 1rem;
    z-index: 10
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

  .links {
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

  .projectIcon {
    width: .8em;
  }

  #projectModal {
    #noUserSelect;
    .modal-footer {
      display: none !important;
    }
    th {
      border-top: none;
    }
    tr {
      cursor: pointer;
    }
  }

  #errorModal {
    .btn-secondary {
      display: none;
    }
  }

  .projectTitle {
    cursor: pointer;
  }

  #nav-info {
    background: @richPurple;
    color: white;
    border-bottom: 2px solid @richPurple;
    padding-top: .5em;
    z-index: 5;
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

  #mobileMenuIcon {
    cursor: pointer;
  }

  .btn {
    float: right;
    margin-left: .5em;
    margin-bottom: 1em;
    display: inline-block;
  }

  .cpButton {
    margin: 5px;
  }

  #saveProject {
    float: left;
  }

  #currentPageIcon {
    width: 1.5rem !important;
  }

  #mobileMenu {
    color: white;
    z-index: 4;
    background: @richPurple;
    position: absolute;
    width: 100vw;
    padding: .5rem 0 1rem 0;
  }

  //tabs
  .nav-item a {
    color: black !important;
  }


</style>
