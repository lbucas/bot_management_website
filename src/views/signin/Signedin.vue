<template>
  <div id="signin">
    <div class="card" id="loginCard">
      <img src="../../assets/logo/emdgreen.png"/>
      <h6>Signing you in automatically..</h6>
    </div>
  </div>
</template>

<script>
  export default {
    name: "signedin",
    created() {
      this.$tools.cookies.clear('signingIn')
      let token = this.$route.query.accessToken
      this.$store.dispatch('setAccessToken', token)
      let today = new Date()
      this.$tools.cookies.set('access_token', token)
      this.$tools.cookies.set('access_token_validUntil', today.setDate(today.getDate() + 14))
      this.$parent.projectCheck()
      this.$router.push('/')
    }
  }
</script>

<style lang="less" scoped>
  @richPurple: #503291;

  #signin {
    background: @richPurple;
    background-repeat: no-repeat;
    background-attachment: fixed;
    width: 100vw;
    height: 100vh;
    display: block;
    overflow: auto;
    z-index: 2;
    padding-top: 2em;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  #sidenavigation {
    display: none;
  }

  #loginCard {
    width: 100%;
    max-width: 30em;
    margin: auto;
    padding: 1em;
    text-align: center;
    margin-bottom: 1em;
    padding: 2em;
  img {
    width: 50%;
    margin: auto;
  }
  h6 {
    margin-top: 3em;
  }
  }

</style>
