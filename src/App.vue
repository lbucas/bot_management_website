<template>
  <b-container fluid id="app">
    <b-row>
      <b-col md="3" lg="2" id="sidenavigation" v-if="sidebarVisible">
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
        <h6>{{userDisplayName}}</h6>
        <div class="links">
          <ul>
            <li v-for="nl in navLinks" class="navLink font-weight-light" @click="route(navLinkKeys[nl] || nl)"
                :active="$route.name === (navLinkKeys[nl] || nl)">
              <icon :icon="navLinkKeys[nl] || nl" class="navIcon"/>
              {{l[nl]}}
            </li>
          </ul>
        </div>
        <b-row id="langInfo" class="text-left">
          <b-col>
            <span @click="$root.modalOpen('langSelModal')">
              <icon icon="lang"/>
              {{$store.state.selectedLang}}
            </span>
          </b-col>
        </b-row>
      </b-col>

      <b-col id="mainCol">
        <b-row>
          <b-col cols="12">
            <b-row id="mobile-nav" class="shadow" v-if="sidebarVisible">
              <b-col id="currentPage" class="text-left">
                <h4>
                  <icon id="currentPageIcon" :icon="navLinkKeys[$route.name] || $route.name"/>
                  {{l[$route.name]}}
                </h4>
              </b-col>
              <b-col id="mobileMenuIconCol" class="text-right">
                <div @click="mobileMenuOpen = !mobileMenuOpen">
                  <icon id="mobileMenuIcon" icon="menu"/>
                </div>
              </b-col>
            </b-row>
          </b-col>
          <b-col cols="12">
            <transition name="fade">
              <div id="mobileMenu" v-if="mobileMenuOpen">
                <h6>{{userDisplayName}}</h6>
                <h6 class="projectTitleMobile" @click=" $root.modalOpen('projectModal')">
                  <icon class="projectIcon" icon="Projects"/>
                  {{project.name}}
                </h6>
                <div class="links">
                  <ul>
                    <li v-for="nl in navLinks" class="navLink font-weight-light"
                        @click="route(navLinkKeys[nl] || nl); mobileMenuOpen = false"
                        :active="$route.name === (navLinkKeys[nl] || nl)">
                      <icon :icon="navLinkKeys[nl] || nl" class="navIcon"/>
                      {{nl}}
                    </li>
                  </ul>
                </div>
              </div>
            </transition>
          </b-col>

          <b-col>
            <div id="routerContent">
              <transition name="view" mode="out-in">
                <keep-alive>
                  <router-view/>
                </keep-alive>
              </transition>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-modal size="lg" id="projectModal" :title="l.chooseProject" cancel-disabled no-close-on-esc
             no-close-on-backdrop
             hide-header-close ok-disabled>
      <div class="table-responsive">
        <loader :loading="projectsLoading"/>
        <table class="table table-hover">
          <thead>
          <thead>
          <th>{{$root.l.title}}</th>
          <th>{{l.yourRole}}</th>
          </thead>
          <tbody>
          <tr v-for="p in projects" @click="chooseProject(p, true)">
            <td>{{p.name}}</td>
            <td>{{p.role}}</td>
          </tr>
          <tr v-if="createProject">
            <td>
              <div class="form-group">
                <input v-model="newProjectName" :placeholder="l.provideName" class="form-control">
              </div>
            </td>
            <td>
              <b-button variant="primary" id="saveProject" @click="saveProject">{{$root.l.save}}</b-button>
            </td>
          </tr>
          </tbody>
        </table>
        <b-button variant="primary" class="cpButton" @click="createProject=true" v-if="!createProject">
          {{l.createAProject}}
        </b-button>
        <b-button variant="secondary" class="cpButton" @click="createProject=false" v-if="createProject">
          {{$root.l.cancel}}
        </b-button>
      </div>
    </b-modal>

    <notifications group="all" position="bottom right" :duration="(-1)" :max="(5)">
      <template slot="body" slot-scope="props">
        <div class="vue-notification">
          <a class="vn-title">
            {{props.item.title}}
          </a>
          <a class="close" @click="props.close">
            ×
          </a>
          <div v-html="props.item.text">
          </div>
        </div>
      </template>
    </notifications>

    <b-modal id="errorModal" title="An Error occurred" cancel-disabled>
      <h6>{{l.errorOccured}}</h6>
      <br>
      <error-display :src="error.status" desc="Type"/>
      <error-display :src="error.message" desc="Message"/>
      <error-display :src="error.route" desc="Target"/>
      <error-display :src="error.sentData" desc="Sent Data"/>
    </b-modal>

    <b-modal id="langSelModal" :title="l.selectLang">
      <Table>
        <tr v-for="(dispLang, lang) in langs" class="langOption" @click="selectLang(lang)">
          <td>{{dispLang}}</td>
        </tr>
      </Table>
    </b-modal>

    <div id="flaticon">Icons made by <a href="https://www.flaticon.com/authors/smashicons"
                                        title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/"
                                                                                  title="Flaticon">www.flaticon.com</a>
      is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0"
                        target="_blank">CC 3.0 BY</a></div>

  </b-container>
</template>

<script>
  import ErrorDisplay from "./components/ErrorDisplay"
  import supportedLangs from './lang/support'
  import Table from "./components/Table"

  export default {
    name: 'app',
    components: {Table, ErrorDisplay},
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
        mobileMenuOpen: false,
        langs: supportedLangs
      }
    },
    computed: {
      l() {
        return this.$store.state.lang.app
      },
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
      sidebarVisible() {
        return !(['Signin', 'Signedin', 'Databots'].includes(this.$route.name))
      }
    },
    methods: {
      route(togo) {
        togo = togo.toLowerCase()
        this.$router.push('/admin/' + togo)
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
      },
      selectLang(name) {
        let lang = this.$tools.lang(name)
        this.$store.commit('setLang', {lang, name})
        this.$tools.cookies.set('langPreference', name)
        this.$root.modalClose('langSelModal')
      }
    },
    created() {
      this.getUser()
      this.$store.dispatch('notificationStream', this.$notify)
      if (!(this.$route.name === 'Signin' || this.$route.name === 'Signedin')) {
        let at = this.$tools.cookies.get('access_token')
        let expires = this.$tools.cookies.get('access_token_validUntil')
        let today = new Date()
        if (at && parseInt(expires) > new Date().getTime()) {
          this.$store.dispatch('setAccessToken', at)
          this.projectCheck()
        } else {
          this.$router.push('/signin')
        }
      }
    },
    mounted() {
      if (!this.sidebarVisible) this.projectCheck()
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
  @import "style/colors";
  @import "style/mixins";
  @import "style/transitions";
  @import "style/scrollbar";

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

    #langInfo {
      display: none;
    }
  }

  @media (min-width: 768.1px) {
    #mobileMenu {
      display: none;
    }

    #mobile-nav {
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

  #mobile-nav {
    height: 3em;
    #mobileMenuIcon {
      cursor: pointer;
    }
    background: @richPurple;
    color: white;
    z-index: 5;
    padding: .5rem 1rem 0 1rem;
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
    margin-top: 9vh;
    ul {
      list-style-type: none;
      padding-left: 1em;
    }
    li {
      text-align: left;
      font-size: 1em;
      cursor: pointer;
      margin-bottom: .7rem;
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

  #routerContent {
    text-align: left;
    height: 100vh;
    padding-right: 2em;
    padding-left: 1em;
  }



  #langInfo {
    position: absolute;
    bottom: 10px;
    font-size: .7rem;
    span {
      cursor: pointer;
    }
    img {
      width: .8rem
    }
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
    left: 0;
    width: 100%;
    padding: .5rem 0 1rem 0;
  }

  //tabs
  .nav-item a {
    color: black !important;
  }

  .vue-notification {
    text-align: left;
    background: @richBlue;
    border-left-color: @richBlueDarker;
    cursor: pointer;
    font-size: .7rem;
    .vn-title {
      font-size: .9rem;
    }
  }

  #langSelModal {
    #noUserSelect;
    tr {
      cursor: pointer;
    }
    .modal-footer {
      display: none !important;
    }
  }

</style>
