<template>
  <master-detail route="botUsers" :tableheading="l.botUsers">
    <scrollable pos="oneTab">
      <custom-form route="botUsers">
        <fr-input model-key="id" :label="l.muid"/>
        <fr-input model-key="role" :label="l.role" :editable="false"/>
      </custom-form>
      <save :on-save="addUser" v-if="onEdit"/>
      <delete :on-delete="deleteUser" v-else/>
    </scrollable>
  </master-detail>

</template>

<script>
  export default {
    name: "users",
    computed: {
      l() {
        return this.$store.state.lang.users
      },
      userDetail() {
        return this.$store.state.detailItem.botUsers
      },
      muid: {
        get() {
          return this.userDetail.id
        },
        set(id) {
          this.$store.commit('updateDetailItem', {route: 'botUsers', key: 'id', value: id})
        }
      },
      onEdit() {
        return this.$store.state.onEdit.botUsers
      }
    },
    watch: {
      muid(id) {
        if (id) {
          id = id.replace('m', 'M')
          id = id.replace('x', 'X')
          this.muid = id
        }
      }
    },
    methods: {
      async addUser() {
        let state = this.$store.state
        this.$store.commit('loading', 'botUsers')
        await this.$store.dispatch('post', {
          route: `projects/${state.projectId}/addBotUser`,
          toPost: {MUID: this.muid}
        })
        let p = {}
        this.$tools.clone(p, state.projects[state.projectId])
        p.botUserIds.push(this.muid)
        this.$store.commit('set', {route: 'projects', item: this.$tools.arrayToObject([p])})
        this.$store.commit('endEditing', 'botUsers')
        this.$store.commit('finishedLoading', 'botUsers')
        this.$store.commit('setDetailItem', {route: 'botUsers', item: this.$store.getters.botUsers[this.muid]})
      },
      deleteUser() {
      }
    }
  }
</script>

<style scoped>

</style>
