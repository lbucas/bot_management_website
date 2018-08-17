<template>
  <div id="settings">
    <loader :loading="loading"/>
    <scrollable pos="full">
      <b-row>
        <b-col lg="8">

          <div class="settingsSection">
            <h5>{{l.deployment}}</h5>
            <label> {{l.location}}</label>
            <p id="botUrl">{{location}}</p>
            <div v-if="deployState<2">
              <center-button>
                <update :update="deployBot" :loading="deployState===1" variant="info" :text="deployButtonText"
                        :icon-visible="deployState === 1"/>
              </center-button>
            </div>
          </div>

          <div class="settingsSection">
            <h5>{{l.projectSettings}}</h5>
            <label> {{l.team}}</label>
            <input-add-button :show-add="validTeamMember" :on-add="addMember">
              <b-input v-model="nextTeamMember" :placeholder="l.addMember"/>
            </input-add-button>
            <badges :values="team" :remove="removeMember"/>
          </div>

          <div class="settingsSection">
            <h5>{{l.deleteProj}}</h5>
            <center-button>
              <delete :on-delete="deleteProject"/>
            </center-button>
          </div>
        </b-col>
        <b-col lg="4">
        </b-col>
      </b-row>
    </scrollable>
  </div>
</template>

<script>
  import InputAddButton from "../components/InputAddButton"
  import Badges from "../components/Badges"
  import CenterButton from "../components/buttons/CenterButton"

  export default {
    name: 'settings',
    components: {CenterButton, Badges, InputAddButton},
    data() {
      return {
        nextTeamMember: '',
        loading: true,
        botLocation: ''
      }
    },
    computed: {
      l() {
        return this.$store.state.lang.settings
      },
      projectId() {
        return this.$store.state.projectId
      },
      project() {
        return this.$store.state.projects[this.projectId]
      },
      team() {
        return this.project ? this.project.teamMemberIds : []
      },
      validTeamMember() {
        return !this.team.includes(this.nextTeamMember) &&
          this.nextTeamMember.length === 7 &&
          ['m', 'M', 'x', 'X'].includes(this.nextTeamMember.substring(0, 1)) &&
          Number.isInteger(parseInt(this.nextTeamMember.substring(1)))
      },
      bot() {
        return this.$store.state.bot
      },
      deployState() {
        let dep = this.bot.deploying
        if (dep === false) return 2 // is ready
        if (dep) return 1 // is deploying
        return 0 // not deployed yet
      },
      location() {
        return this.bot.url || this.l.notDeployedYet
      },
      deployButtonText() {
        return this.deployState === 1 ? this.l.deploymentInProgess : this.l.deploy
      }
    },
    created() {
      this.checkbot()
    },
    methods: {
      async addMember() {
        this.loading = true
        await this.$store.dispatch('post', {
          route: `projects/${this.projectId}/addMember`,
          toPost: {MUID: this.nextTeamMember}
        })
        let p = {}
        this.$tools.clone(p, this.project)
        p.teamMemberIds.push(this.nextTeamMember)
        this.$store.commit('set', {route: 'projects', item: this.$tools.arrayToObject([p])})
        this.nextTeamMember = ''
        this.loading = false
      },
      async deleteProject() {
        await this.$store.dispatch('delete', {route: 'projects', toDelete: this.projectId})
        this.$root.modalOpen('projectModal')
      },
      removeMember(i) {
      },
      async checkbot() {
        await this.$store.dispatch('checkDeploymentState')
        this.loading = false
      },
      deployBot() {
        this.$store.dispatch('deployBot')
      }
    },
    watch: {
      nextTeamMember(v) {
        v = v.replace('m', 'M')
        v = v.replace('x', 'X')
        this.nextTeamMember = v
      }
    }
  }
</script>

<style lang="less" scoped>
  #settings {
    padding-top: 1em;
    .settingsSection {
      margin-bottom: 4rem;
    }
  }

  #botUrl {
    display: inline;
    font-style: italic;
  }
</style>
