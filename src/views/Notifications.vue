<template>


</template>

<script>
  export default {
    name: "notifications",
    props: {},
    data() {
      return {}
    },
    computed: {
      notifications() {
        return this.$store.state.notifications
      }
    },
    created() {
      this.notificationStream()
    },
    methods: {
      notificationStream() {
        this.$store.dispatch('notificationStream')
      }
    },
    watch: {}
  }
</script>

<style lang="less" scoped>


</style>
