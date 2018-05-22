<template>
  <b-container fluid id="app">
    <b-row>
      <b-col md="3" lg="2" id="navigation">
        <b-row>
          <b-col>
            <div id="logoDiv">
              <img id="emdlogo" src="./assets/logo/emdgreen.png">
            </div>
          </b-col>
        </b-row>
        <h5>Bot Management</h5>
        <h6 id="projectTitle" @click="projectDialog"><img src="./assets/icons/projects.svg" id="projectIcon"/>
          {{$root.project.title}}</h6>
        <div id="links">
          <ul v-for="nl in navLinks">
            <li class="navLink font-weight-light" @click="route(nl)">
              <img v-bind:src="(require('./assets/icons/'+nl+'.svg'))" class="navIcon"/>
              {{nl}}
            </li>
          </ul>
        </div>

      </b-col>
      <b-col>
        <b-row id="nav-info">
          <b-col id="currentPage" class="text-left">
            <h4>{{current}}</h4>
          </b-col>
          <b-col id="userInfo" class="text-right">
            {{UserName}}
          </b-col>
        </b-row>
        <div id="routerContent">
        <router-view/>
        </div>
      </b-col>
    </b-row>

    <b-modal size="lg" id="projectModal" title="Choose your project" no-close-on-esc no-close-on-backdrop
             hide-header-close>
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
          <th>Title</th>
          <th>Your Role</th>
          </thead>
          <tbody>
          <tr v-for="p in projects" @click="chooseProject(p)">
            <td>{{p.title}}</td>
            <td>{{p.role}}</td>
          </tr>
          </tbody>
        </table>
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
  export default {
    name: 'app',
    data() {
      return {
        current: 'Home',
        UserName: 'John Doe',
        navLinks: [
          'Datasources',
          'Intents',
          'Entities',
          'Users',
          'Settings'
        ],
        projects: [
          {id: 1, title: 'Rebate Data', role: 'Member'},
          {id: 2, title: 'Sales Data', role: 'Creator'}
        ]
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
      },
      checkProject() {
        var t = this
        try {
          var p = JSON.parse(t.$root.getCookie('project'))
          this.$root.project = p
        } catch (e) {
          t.projectDialog()
        }
        console.log(p)
      },
      projectDialog() {
        this.$root.modalOpen('projectModal')
      }
    },
    mounted() {
      this.checkProject()
    }
  }
</script>

<style lang="less">
  @richPurple: #503291;
  @vibCyan: #2dbecd;
  @vibGreen: #a5cd50;

  @font: 'Verdana';

  #app {
    font-family: @font, 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    background: #fffffa;
  }

  #navigation {
    background: @richPurple;
    height: 100vh;
    color: @vibGreen;
    z-index: 1;
    position: -webkit-sticky;
  }

  #nav-info {
    min-height: 3em;
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
    background: white;
    border-bottom: 2px solid lightgrey;
    padding-top: .5em;
  }

  #routerContent {
    padding: 2em;
    text-align: left;
  }

</style>
