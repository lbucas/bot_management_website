<template>
  <b-row>
    <b-col class="text-center">
      <span class="selectNote" v-if="joinDetails.table1.name == ''">Please choose a table from the left side</span>
      <span v-if="!(joinDetails.table1.name == '')">{{joinDetails.table1.name}}</span>
      <select class="form-control" v-if="!((joinDetails.table1.name == '') || (joinDetails.table2.name == ''))"
              v-model="joinDetails.editjoin.id1"
              v-bind:disabled="!editing && joinDetails.editjoin.id !== ''">
        <option value="none"></option>
        <option v-for="a in joinDetails.table1.attributes" v-bind:value="a.id">{{a.name}} ({{a.datatype}})</option>
      </select>
    </b-col>
    <b-col cols="1">
      <icon icon="arrowtwoway"/>
      <button v-if="!editing && joinDetails.editjoin.id !== ''" @click="editing = true" type="button"
              id="editConnection" class="close">×
      </button>
    </b-col>
    <b-col class="text-center">
      <span class="selectNote" v-if="joinDetails.table2.name == ''">Please choose a table from the right side</span>
      <span v-if="!(joinDetails.table2.name == '')">{{joinDetails.table2.name}}</span>
      <select class="form-control" v-if="!((joinDetails.table1.name == '') || (joinDetails.table2.name == ''))"
              v-model="joinDetails.editjoin.id2"
              v-bind:disabled="!editing && joinDetails.editjoin.id !== ''">
        <option value="none"></option>
        <option v-for="a in joinDetails.table2.attributes" v-bind:value="a.id">{{a.name}} ({{a.datatype}})</option>
      </select>
    </b-col>
  </b-row>
</template>

<script>
  import Icon from "../../components/Icon"
  export default {
    name: "ConnectionEdit",
    components: {Icon},
    data() {
      return {
        editing: false
      }
    },
    computed: {
      joinDetails() {
        return this.$store.state.detailItem.joins
      }
    }
  }
</script>

<style scoped>

</style>
