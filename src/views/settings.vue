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
          <b-button @click="updateProject" variant="secondary">Reset</b-button>
        </form>
      </b-col>
      <b-col></b-col>
      <b-col lg="5">
        <h5>Danger Zone</h5>
        <b-button variant="danger" @click="deleteProject">Delete Project</b-button>
      </b-col>
    </b-row>



  </div>

</template>

<script>
  import FormRowInput from "../components/form/FormRowInput"
  import FormRowBlank from "../components/form/FormRowBlank"
  import Loader from "../components/Loader"
  export default {
    name: 'settings',
    components: {Loader, FormRowBlank, FormRowInput},
    data() {
      return {
        project: {
          name: ''
        },
        loading: false
      }
    },
    computed: {
      activePID() {
        return this.$root.project.id
      },
      collaborators() {
        return {}
      }
    },
    created() {
      this.updateProject()
    },
    methods: {
      updateProject() {
        this.$root.clone(this.project, this.$root.project)
      },
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
        var id = this.$root.project.id
        this.$root.delete(
          'projects',
          id,
          function () {
            t.$delete(t.$parent.projects, id)
            t.$root.projectDialog()
          }
        )
      }
    }
  }
</script>

<style lang="less" scoped>
  #settings {
    padding-top: 1em;
  }
</style>
