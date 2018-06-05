<template>
  <div>
    <b-button variant="danger" @click="deleteProject">Delete Project</b-button>
  </div>

</template>

<script>
  export default {
    name: 'settings',
    methods: {
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

<style scoped>

</style>
