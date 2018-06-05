<template>

</template>

<script>
  export default {
    name: 'dashboard',
    created() {
      this.$root.checkSigninAndProject()
      this.$parent.getUser()
    }
  }
</script>

<style scoped>

</style>
