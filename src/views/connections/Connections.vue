<template>
  <div id="editConnections">
    <loader :loading="connectionLoading"/>
    <b-tabs id="connectionTabs">
      <b-tab class="tabTitle" :title="l.standard" active>
        <div>
          <b-row>
            <table-selection v-model="editJoin.table1"/>
            <table-selection v-model="editJoin.table2" :joined="isJoined" :disabled="editJoin.table1"/>
            <b-col lg="6" id="selectionCol">
              <h6>{{l.chooseAttr}}</h6>
              <b-row>
                <attribute-select v-model="editJoin.attribute1" :table-id="editJoin.table1"
                                  :disabled="editJoin.id && !editing"/>
                <b-col cols="1">
                  <icon icon="arrowtwoway"/>
                  <button v-if="editJoin.id && !editing" @click="editing = true" type="button"
                          id="editConnection" class="close">×
                  </button>
                </b-col>
                <attribute-select v-model="editJoin.attribute2" :table-id="editJoin.table2"
                                  :disabled="editJoin.id && !editing"/>
              </b-row>
              <div>
                <save-button v-if="editing || !editJoin.id" class="connectionBtns" :on-save="saveJoin"/>
                <delete-button class="connectionBtns" :on-delete="deleteConnection" v-if="editJoin.id"/>
              </div>
            </b-col>
          </b-row>
        </div>
      </b-tab>
      <b-tab class="tabTitle" :title="l.visual">
        <b-row>
          <b-col cols="3">
            <table class="table connectionTable">
              <tbody>
              <tr v-for="(ds, id) in datasources">
                <td>
                <span v-b-toggle="'tablesFor3' + id" @click="expand(3, id)">
                  <b-form-checkbox @change="checkboxDs(id)"/>
                  <expand-icon :expanded="(ds.id in expanded)"/>
                  {{ds.name}}
                </span>
                  <b-collapse v-bind:id="'tablesFor3' + id" class="mt-2">
                    <ul class="tableListCheckBox">
                      <li v-for="t in ds.tables">
                        <b-form-checkbox v-model="t.visible">
                          {{t.name}}
                        </b-form-checkbox>
                      </li>
                    </ul>
                  </b-collapse>
                </td>
              </tr>
              </tbody>
            </table>
          </b-col>
          <b-col ref="dragDrop">
            <connections-visual/>
          </b-col>
        </b-row>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
  import Loader from "../../components/Loader"
  import DeleteButton from "../../components/buttons/DeleteButton"
  import ExpandIcon from "../../components/ExpandIcon"
  import Icon from "../../components/Icon"
  import ConnectionsVisual from "./ConnectionsVisual"
  import TableSelection from "../../components/TableSelection"
  import AttributeSelect from "../../components/AttributeSelect"
  import SaveButton from "../../components/buttons/SaveButton"

  export default {
    name: "connections",
    components: {
      SaveButton,
      AttributeSelect,
      TableSelection,
      ConnectionsVisual,
      Icon,
      ExpandIcon,
      DeleteButton,
      Loader
    },
    data() {
      return {
        expanded: {},
        editJoin: {
          id: null,
          table1: null,
          table2: null,
          attribute1: null,
          attribute2: null
        },
        editing: false,
        checkboxDsState: {},
        savable: false
      }
    },
    computed: {
      l() {
        return this.$store.state.lang.connections
      },
      datasources() {
        return this.$store.state.datasources
      },
      tables() {
        return this.$store.getters.tables
      },
      joins() {
        return this.$store.getters.joinsExtended
      },
      joinsPerTable() {
        return this.$store.getters.joinsPerTable
      },
      connectionLoading() {
        return this.$store.state.loaders.joins
      },
      joinDetails() {
        return this.$store.state.detailItem.joins
      },
      isJoined() {
        return this.editJoin.table1 ? this.joinsPerTable[this.editJoin.table1] : {}
      },
      activeJoin() {
        let t1 = this.editJoin.table1
        let t2 = this.editJoin.table2
        if (t1 && t2) {
          try {
            let j = this.joinsPerTable[t1][t2]
            return j
          } catch (e) {
          }
        }
        return null
      }
    },
    created() {
      this.getJoinsAndDs()
    },
    methods: {
      getJoinsAndDs() {
        this.$store.dispatch('load', ['datasources', 'joins'])
      },
      expand(table, id) {
        if (id in this.expanded) {
          this.$delete(this.expanded, id)
        } else {
          this.$set(this.expanded, id, true)
        }
      },
      saveJoin() {
        let toSave = {
          attributeIds: [
            this.editJoin.attribute1, this.editJoin.attribute2
          ]
        }
        if (this.editJoin.id) {
          toSave.id = this.editJoin.id
          this.$store.dispatch('patch', {route: 'joins', toCreate: toSave})
        } else {
          this.$store.dispatch('create', {route: 'joins', toCreate: toSave})
        }
      },
      deleteConnection() {
        this.$store.dispatch('delete', {route: 'joins', toDelete: this.editJoin.id})
      },
      checkboxDs(id) {
        let ds = this.datasources[id].tables
        let state = !(this.checkboxDsState[id])
        if (state === undefined) {
          state = true
        }
        for (let k in ds) {
          ds[k].visible = state
        }
        this.checkboxDsState[id] = state
      }
    },
    watch: {
      activeJoin: {
        deep: true,
        handler(aj) {
          if (aj) {
            this.editJoin.attribute1 = aj.a1
            this.editJoin.attribute2 = aj.a2
            this.editJoin.id = aj.id
            this.editing = false
          } else {
            this.editJoin.attribute1 = null
            this.editJoin.attribute2 = null
            this.editJoin.id = null
          }
        }
      }
    }
  }
</script>

<style lang="less">
  @import "../../style/colors";
  @import "../../style/mixins";

  #selectionCol {
    margin-top: 1rem;
    text-align: center;
    select {
      margin-top: .5em;
    }
    .connectionBtns {
      margin-top: 1em;
    }
    #editConnection {
      margin-top: .5em;
    }
  }

  #editConnections {
    margin-top: 1em;
  }

  .connectionTable {
    #noUserSelect;
    .tableListCheckBox {
      list-style: none;
    }
    td, .custom-checkbox {
      cursor: pointer;
    }
  }


</style>
