<template>
  <b-tabs id="dsTabs">
    <b-tab title="Databases">
      <databases/>
    </b-tab>
    <b-tab title="Excel Files">
      <excel/>
    </b-tab>
  </b-tabs>
</template>

<script>
  import Databases from './Databases'
  import Excel from './Excel'

  export default {
    name: "Datasources",
    components: {Databases, Excel}
  }
</script>

<style scoped>
  #dsTabs {
    padding-top: .5rem;
  }
</style>

