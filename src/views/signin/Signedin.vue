<template>
  <signin-display/>
</template>

<script>
  import SigninDisplay from "./SigninDisplay"

  export default {
    name: "signedin",
    components: {SigninDisplay},
    created() {
      this.$tools.cookies.clear('signingIn')
      let token = this.$route.query.accessToken
      this.$store.dispatch('setAccessToken', token)
      let today = new Date()
      this.$tools.cookies.set('access_token', token)
      this.$tools.cookies.set('access_token_validUntil', today.setDate(today.getDate() + 14))
      let cameFrom = this.$tools.cookies.get('locBeforeSignin') || '/'
      if (cameFrom !== '/') {
        this.$parent.projectCheck()
      }
      this.$router.push(cameFrom)
    }
  }
</script>

<style scoped>

</style>
