<template>
  <b-row>
    <b-col md="12" lg="4">
      <select class="form-control" v-model="datasourceId" :class="{'is-invalid': !valid}"
              :disabled="Object.keys(datasources).length === 1">
        <option v-for="(ds, id) in datasources" v-bind:value="id">{{ds.name}}</option>
      </select>
    </b-col>
    <b-col md="12" lg="4">
      <select class="form-control" v-model="tableId" :class="{'is-invalid': !valid}" :disabled="!datasourceId">
        <option v-for="(t, id) in tablesFiltered" v-bind:value="id">{{t.displayName}}</option>
      </select>
    </b-col>
    <b-col md="12" lg="4">
      <select class="form-control" v-model="inputValue" :class="{'is-invalid': !valid}" :disabled="!tableId">
        <option v-for="(a, id) in attributesFiltered" v-bind:value="id">{{a.name}}</option>
      </select>
    </b-col>
  </b-row>
</template>

<script>
  export default {
    name: "AttributeSelect",
    props: {
      value: {},
      valid: {
        type: Boolean,
        default: true
      },
      datatype: {
        type: String,
        default: null
      }
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
          if (!this.datatype) {
            return t.attributes
          } else {
            let attrs = {}
            for (let key in t.attributes) {
              let a = t.attributes[key]
              if (a.datatype === this.datatype) attrs[key] = a
            }
            return attrs
          }
        }
      },
      inputValue: {
        get() {
          return this.value
        },
        set(v) {
          this.$emit('input', v)
        }
      }
    },
    created() {
      let attr = this.attributes[this.inputValue]
      if (attr) {
        this.datasourceId = attr.datasourceId
        this.tableId = attr.tableId
      } else {
        let keys = Object.keys(this.datasources)
        if (keys.length === 1) this.datasourceId = keys[0]
      }
    },
    methods: {},
    watch: {
      datasourceId(id, old) {
        if (old) this.tableId = null
      },
      tableId(id, old) {
        if (old && !this.attributesFiltered[this.inputValue]) this.inputValue = null
      },
      inputValue(v) {
        if (!this.attributesFiltered[v]) {
          let attr = this.attributes[this.inputValue]
          if (attr) {
            this.datasourceId = attr.datasourceId
            this.tableId = attr.tableId
          }
        }
      },
      datatype(v) {
        if (v && this.attributes[this.inputValue].datatype === v) this.inputValue = null
      }
    }
  }
</script>

<style scoped>

</style>
