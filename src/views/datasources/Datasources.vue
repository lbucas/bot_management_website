<template>
  <b-tabs id="dsTabs">
    <b-tab :title="l.databases">
      <databases/>
    </b-tab>
    <b-tab :title="l.excel">
      <excel/>
    </b-tab>
    <b-tab :title="l.flatfiles">
      <flatfiles/>
    </b-tab>
  </b-tabs>
</template>

<script>
  import Databases from './Databases'
  import Excel from './Excel'
  import Flatfiles from "./Flatfiles"

  export default {
    name: "Datasources",
    components: {Flatfiles, Databases, Excel},
    created() {
      this.$store.dispatch('load', 'datasources')
    },
    computed: {
      l() {
        return this.$store.state.lang.datasources
      }
    }
  }
</script>

<style scoped>
  #dsTabs {
    padding-top: .5rem;
  }
</style>

