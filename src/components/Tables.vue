<template>
  <div>
    <table class="table" id="dsTables">
      <tbody>
      <tr v-if="Object.keys(tables).length == 0" class="noEntries">
        <td>The schema is not imported yet</td>
      </tr>
      <tr v-for="(t, id) in tables">
        <td>
        <span v-b-toggle="'tables' + id" @click="expand(id)">
          <expand-icon :expanded="(id in expanded)"/>
          {{t.displayName}}
        </span>
          <b-collapse :id="'tables' + id" class="mt-2">
            <ul>
              <li v-if="Object.keys(t.attributes).length == 0" class="noEntries">No attributes found for this
                table
              </li>
              <li v-for="a in t.attributes">
                {{a.name}} ({{a.datatype}})
              </li>
              <li>
                <update-button class="updateAttribute" text="Update Attributes"
                               :update="function(){updateAttributes(t.id)}" v-if="database"
                               :loading="updatingAttr[t.id] || tablesLoading || false" size="sm"/>
              </li>
            </ul>
          </b-collapse>
        </td>
      </tr>
      </tbody>
    </table>
    <update-button v-if="database" :loading="tablesLoading" :update="updateTables" text="Update Tables"/>
  </div>
</template>

<script>
  import Expandable from './mixins/Expandable'
  import UpdateButton from "./buttons/UpdateButton"
  import ExpandIcon from "./ExpandIcon"

  export default {
    name: "Tables",
    components: {ExpandIcon, UpdateButton},
    mixins: [Expandable],
    props: {
      database: {
        default: null
      },
      excelFile: {
        default: null
      },
      flatfile: {
        default: null
      }
    },
    data() {
      return {
        updatingAttr: {},
        tablesLoading: false
      }
    },
    computed: {
      datasource() {
        try {
          if (this.database) {
            return this.$store.state.datasources[this.$store.state.databases[this.database].datasourceId]
          } else if (this.excelFile) {
            return this.$store.getters.tablesPerExcel[this.excelFile]
          } else {
            return this.$store.getters.tablesPerFlatfile[this.flatfile]
          }
        } catch (e) { return null }
      },
      tables() {
        if (this.datasource) {
          return this.datasource.tables || this.datasource
        } else {
          return {}
        }
      }
    },
    created() {
      this.getTables()
    },
    methods: {
      getTables() {
        if (this.database) {
          if (!this.datasource.tables) {
            this.$store.dispatch('update', 'datasources')
          }
        } else if (this.excelFile || this.flatfile) {
          // loadTables
        }
      },
      async updateTables() {
        let toPost = {databaseId: this.database}
        this.tablesLoading = true
        await this.$store.dispatch('post', {route: 'databases/updateTables', toPost: toPost})
        await this.$store.dispatch('update', 'datasources')
        this.tablesLoading = false
      },
      async updateAttributes(id) {
        let toPost = {tableId: id}
        this.$set(this.updatingAttr, id, true)
        await this.$store.dispatch('post', {route: 'tables/updateAttributes', toPost: toPost})
        await this.$store.dispatch('update', 'datasources')
        this.$set(this.updatingAttr, id, false)
      }
    },
    watch: {}
  }
</script>

<style scoped>

</style>
