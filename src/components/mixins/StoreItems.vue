<template>

</template>

<script>
  export default {
    name: "StoreItems",
    computed: {
      datasources() {
        return this.$store.state.datasources
      },
      datasourcetypes() {
        return this.$store.state.datasourcetypes
      },
      intents() {
        return this.$store.state.intents
      },
      aggregations() {
        return this.$store.state.aggregations
      },
      entities() {
        return this.$store.state.entities
      },
      charttypes() {
        return this.$store.state.charttypes
      }
    }
  }
</script>

<style scoped>

</style>
