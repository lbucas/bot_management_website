<template>
  <b-tabs id="dsTabs">
    <b-tab title="Databases">
      <databases/>
    </b-tab>
    <b-tab title="Excel Files">
      <excel/>
    </b-tab>
    <b-tab title="Flatfiles">
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
    }
  }
</script>

<style scoped>
  #dsTabs {
    padding-top: .5rem;
  }
</style>

