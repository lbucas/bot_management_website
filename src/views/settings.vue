<template>
  <div id="settings">
    <Loader :loading="loading"/>
    <b-row>
      <b-col lg="6">
        <h5>Project Settings</h5>
        <form>
          <form-row-input v-model="project.name" label="Project Name"/>
          <form-row-blank big  label="Collaborators">

          </form-row-blank>
          <b-button @click="saveProject" variant="primary">Save</b-button>
          <b-button @click="" variant="secondary">Reset</b-button>
        </form>
      </b-col>
      <b-col></b-col>
      <b-col lg="5">
        <h5>Danger Zone</h5>
        <delete-button :on-delete="deleteProject"/>
      </b-col>
    </b-row>



  </div>

</template>

<script>
  import FormRowInput from "../components/form/FormRowInput"
  import FormRowBlank from "../components/form/FormRowBlank"
  import Loader from "../components/Loader"
  import DeleteButton from "../components/buttons/DeleteButton"
  export default {
    name: 'settings',
    components: {DeleteButton, Loader, FormRowBlank, FormRowInput},
    data() {
      return {
        loading: false
      }
    },
    computed: {
      projectId() {
        return this.$store.state.projectId
      },
      project() {
        return this.$store.state.projects[this.projectId]
      },
      collaborators() {
        return {}
      }
    },
    created() {},
    methods: {
      saveProject() {
        var t = this
        var toSend = {
          name: t.project.name,
          merckUserId: t.project.merckUserId
        }
        t.loading = true
        this.$root.patch(
          'projects/' + this.project.id,
          toSend,
          function () {
            t.loading = false
          }
        )
      },
      deleteProject() {
        var t = this
        t.$store.dispatch('delete', {route: 'projects', toDelete: t.projectId})
          .then(() => {
            t.$root.modalOpen('projectModal')
          })
      }
    }
  }
</script>

<style lang="less" scoped>
  #settings {
    padding-top: 1em;
  }
</style>
