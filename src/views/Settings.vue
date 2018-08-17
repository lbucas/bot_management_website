<template>
  <div id="settings">
    <loader :loading="loading"/>
    <scrollable pos="full">
      <b-row>
        <b-col lg="6">

          <div class="settingsSection">
            <h5>{{l.deployment}}</h5>
            <label> {{l.location}}</label>
            <p>{{botLocation}}</p>
            <badges :values="team" :remove="removeMember"/>
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
        <b-col></b-col>
        <b-col lg="5">
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
        loading: false,
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
      }
    },
    created() {
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
</style>
