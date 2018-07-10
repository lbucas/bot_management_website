<template>
  <form-row-blank :label="label">
    <input v-if="!onEdit" type="text" readonly class="form-control-plaintext"
           v-model="currentAttributeFullName">
    <b-row v-if="onEdit">
      <b-col md="12" lg="4">
        <select class="form-control" v-model="datasourceId" :class="{'is-invalid': !valid}">
          <option v-for="(ds, id) in datasources" v-bind:value="id">{{ds.name}}</option>
        </select>
      </b-col>
      <b-col md="12" lg="4">
        <select class="form-control" v-model="tableId" :class="{'is-invalid': !valid}">
          <option v-for="(t, id) in tablesFiltered" v-bind:value="id">{{t.name}}</option>
        </select>
      </b-col>
      <b-col md="12" lg="4">
        <select class="form-control" v-model="inputValue" :class="{'is-invalid': !valid}">
          <option v-for="(a, id) in attributesFiltered" v-bind:value="id">{{a.name}}</option>
        </select>
      </b-col>
    </b-row>
    <div class="validationMessage" v-if="error">
      {{error}}
    </div>
  </form-row-blank>
</template>

<script>
  import FormRowBlank from "./FormRowBlank"
  import FormComponent from "../mixins/FormComponent"

  export default {
    name: "FormRowAttributeSelect",
    mixins: [FormComponent],
    components: {FormRowBlank},
    props: {
      value: {
        default: null
      },
      label: String
    },
    data() {
      return {
        datasourceId: null,
        tableId: null
      }
    },
    computed: {
      datasources() {
        return this.$store.state.datasources
      },
      tables() {
        return this.$store.getters.tables
      },
      attributes() {
        return this.$store.getters.attributes
      },
      tablesFiltered() {
        let ds = this.datasources[this.datasourceId]
        if (ds === undefined) {
          return {}
        } else {
          return ds.tables
        }
      },
      attributesFiltered() {
        let t = this.tables[this.tableId]
        if (t === undefined) {
          return {}
        } else {
          return this.$tools.arrayToObject(t.attributes)
        }
      },
      currentAttributeFullName() {
        try {
          return this.datasources[this.datasourceId].name + ' - ' + this.tables[this.tableId].name + ' - ' + this.attributes[this.inputValue].name
        } catch (e) {
          return ''
        }
      }
    },
    created() {
      let attr = this.attributes[this.inputValue]
      if (attr) {
        this.datasourceId = attr.datasourceId
        this.tableId = attr.tableId
      }
    },
    watch: {
      datasourceId(id, old) {
        if (old) {
          this.tableId = null
        }
      },
      tableId(id, old) {
        if (old) {
          this.inputValue = null
        }
      }
    }
  }
</script>

<style scoped>
  select {
    margin-bottom: .5em;
  }
</style>
