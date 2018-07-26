<template>

</template>

<script>
  export default {
    name: "StoreItems",
    computed: {
      databases() {
        return this.$store.state.databases
      },
      databasetypes() {
        return this.$store.state.databasetypes
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
