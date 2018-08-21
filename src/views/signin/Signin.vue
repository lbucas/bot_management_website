<template>
  <signin-display/>
</template>

<script>
  import SigninDisplay from "./SigninDisplay"
  import urlLookup from "../../js/urlConfig"
  export default {
    name: "signin",
    components: {SigninDisplay},
    created() {
      let apiUrl = this.$store.state.apiUrl
      let mode = urlLookup.lookup[window.location.hostname]
      let scope = urlLookup.signin[mode]
      window.location.href = `${apiUrl}auth/${scope}/azure`
    }
  }
</script>

<style scoped>

</style>
