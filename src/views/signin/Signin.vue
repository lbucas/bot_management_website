<template>
  <login-display/>
</template>

<script>
  import LoginDisplay from "./LoginDisplay"
  export default {
    name: "signin",
    components: {LoginDisplay},
    created() {
      let apiUrl = this.$store.state.apiUrl
      let scope
      switch (window.location.hostname) {
        case 'webdev.emd-databots.com':
          scope = 'webdev'
          break
        case 'localhost':
          scope = 'local'
          break
        default:
          scope = 'management'
      }
      window.location.href = apiUrl + 'auth/' + scope + '/azure'
    }
  }
</script>

<style scoped>

</style>
