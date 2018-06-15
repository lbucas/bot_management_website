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
        return this.$store.notifications
      }
    },
    created() {
      this.notificationStream()
    },
    methods: {
      notificationStream() {
        var t = this
        t.$store.dispatch('notificationSteam')
          .then(() => {
            t.$store.dispatch('updateNotifications')
              .then(() => {
                t.notificationStream()
              })
          }, () => {
            t.notificationStream()
          })
      }
    },
    watch: {}
  }
</script>

<style scoped>

</style>
