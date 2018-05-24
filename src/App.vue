<template>
  <b-container fluid id="app">
    <b-row>
      <b-col md="3" lg="2" id="sidenavigation" >
        <b-row>
          <b-col>
            <div id="logoDiv">
              <img id="emdlogo" src="./assets/logo/emdgreen.png">
            </div>
          </b-col>
        </b-row>
        <h5>Bot Management</h5>
        <h6 id="projectTitle" @click="$root.projectDialog"><img src="./assets/icons/projects.svg" id="projectIcon"/>
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
      <b-col id="mainCol">
        <b-row id="nav-info" class="shadow">
          <b-col id="currentPage" class="text-left">
            <h4>{{current}}</h4>
          </b-col>
          <b-col id="userInfo" class="text-right">
            {{UserName}}
          </b-col>
        </b-row>
        <div id="routerContent">
          <transition name="component-fade" mode="out-in">
            <router-view/>
          </transition>
        </div>
      </b-col>
    </b-row>

    <b-modal size="lg" id="projectModal" title="Choose your project"  cancel-disabled no-close-on-esc no-close-on-backdrop
             hide-header-close ok-disabled>
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
          'Connections',
          'Intents',
          'Entities',
          'Users',
          'Settings'
        ],
        projects: [
          {id: '5b04364241b70a008681ddc8', title: 'Rebate Data', role: 'Member'},
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
      }
    },
    mounted() {
      this.$root.checkProject()
    }
  }
</script>

<style lang="less">
  // Variables for Merck CI
  @richPurple: #503291;
  @richPurpleDarker: darken(@richPurple, 5%);
  @richPurpleLighter: lighten(@richPurple, 10%);
  @vibCyan: #2dbecd;
  @vibCyanDarker: darken(@vibCyan, 5%);
  @vibCyanLighter: lighten(@vibCyan, 10%);
  @vibGreen: #a5cd50;
  @vibGreenLighter: lighten(@vibGreen, 10%);
  @vibGreenDarker: darken(@vibGreen, 10%);
  @font: 'Verdana';

  // global settings
  #app {
    font-family: @font, 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    background: #fffffa;
  }

  html {
    @media(min-width: 576px) {
      overflow: hidden;
    }
  }

  // wrapper
  #sidenavigation {
    background: @richPurple;
    height: 100vh;
    color: white;
    z-index: 1;
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


  // buttons
  .btn-primary {
    background-color: @richPurple;
    border-color: @richPurple;
    &:hover {
      background-color: @richPurpleDarker;
      border-color: @richPurpleDarker;
    }
    &[disabled] {
      background-color: @richPurpleLighter;
      border-color: @richPurpleLighter;
    }
  }

  .btn-info {
    background: @vibCyan;
    border-color: @vibCyan;
    &:hover {
      background-color: @vibCyanDarker;
      border-color: @vibCyanDarker;
    }
    &[disabled] {
      background-color: @vibCyanLighter;
      border-color: @vibCyanLighter;
    }
  }

  .btn-success {
    background: @vibGreen;
    border-color: @vibGreen;
    &:hover {
      background-color: @vibGreenDarker;
      border-color: @vibGreenDarker;
    }
    &[disabled] {
      background-color: @vibGreenLighter;
      border-color: @vibGreenLighter;
    }
  }

  .btn {
    float: right;
    margin-left: .5em;
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


</style>
