<template>
  <form-row-blank :label="label">
    <input v-if="!onEdit" type="text" readonly class="form-control-plaintext"
           v-model="currentAttributeFullName">
    <b-row v-if="onEdit">
      <b-col md="12" lg="4">
        <select class="form-control" v-model="datasourceId">
          <option v-for="(ds, id) in datasources" v-bind:value="id">{{ds.name}}</option>
        </select>
      </b-col>
      <b-col md="12" lg="4">
        <select class="form-control" v-model="tableId">
          <option v-for="(t, id) in tablesFiltered" v-bind:value="id">{{t.name}}</option>
        </select>
      </b-col>
      <b-col md="12" lg="4">
        <select class="form-control" v-model="attributeId">
          <option v-for="(a, id) in attributesFiltered" v-bind:value="id">{{a.name}}</option>
        </select>
      </b-col>
    </b-row>
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
        default: NaN
      },
      label: String
    },
    data() {
      return {
        datasourceId: NaN,
        tableId: NaN,
        attributeId: NaN,
        changes: 0
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
        var datasourceId = this.datasourceId
        var ds = this.datasources[datasourceId]
        if (ds === undefined) {
          return {}
        } else {
          return ds.tables
        }
      },
      attributesFiltered() {
        var tid = this.tableId
        var t = this.tables[tid]
        if (t === undefined) {
          return {}
        } else {
          return this.$root.arrayToObject(t.attributes)
        }
      },
      currentAttributeFullName() {
        let r
        try {
          r = this.datasources[this.datasourceId].name + ' - ' + this.tables[this.tableId].name + ' - ' + this.attributes[this.attributeId].name
        } catch (e) {
          r = ''
        }
        return r
      }
    },
    created() {
      this.attributeId = this.value
      this.searchDsAndTable()
    },
    methods: {
      searchDsAndTable() {
        let attr = this.attributes[this.attributeId]
        if (attr) {
          this.datasourceId = attr.datasourceId
          this.tableId = attr.tableId
        } else {
          this.count = 2
        }
      }
    },
    watch: {
      value(id) {
        this.changes = 0
        this.attributeId = id
        this.searchDsAndTable()
      },
      attributeId(id) {
        if (id !== this.value) {
          this.$emit("input", id)
        }
      },
      datasourceId(id) {
        if (this.changes > 2) {
          this.attributeId = NaN
          this.tableId = NaN
        } else {
          this.changes++
        }
      },
      tableId(id) {
        if (this.changes > 2) {
          this.attributeId = NaN
        } else {
          this.changes++
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
