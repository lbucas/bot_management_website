<template>
  <div id="editConnections">
    <Loader :loading="connectionLoading"/>
    <b-tabs id="connectionTabs">
      <b-tab class="tabTitle" title="Standard" active>
        <div>
          <b-row>
            <b-col>
              <table class="table connectionTable">
                <tbody>
                <tr v-for="ds in datasources" >
                  <td>
                <span class="" v-b-toggle="'tablesFor1' + ds.id" @click="expand(1, ds.id)">
                  <expand-icon :expanded="(ds.id in expanded.t1)"/>
                  {{ds.name}}
                </span>
                    <b-collapse v-bind:id="'tablesFor1' + ds.id" class="mt-2">
                      <ul>
                        <li v-for="t in ds.tables" @click="choose(1, t)"
                            v-bind:active="joinDetails.table1.id == t.id">
                          {{t.name}}
                        </li>
                      </ul>
                    </b-collapse>
                  </td>
                </tr>
                </tbody>
              </table>
            </b-col>
            <b-col>
              <table class="table connectionTable">
                <tbody>
                <tr v-for="(ds, id) in datasources">
                  <td>
                <span v-b-toggle="'tablesFor2' + id" @click="expand(2, id)">
                  <expand-icon :expanded="(ds.id in expanded.t2)"/>
                  {{ds.name}}
                </span>
                    <b-collapse v-bind:id="'tablesFor2' + id" class="mt-2">
                      <ul>
                       <li
                          v-bind:class="{'isjoined': checkIfJoined(joinDetails.table1.id, t.id), 'disabledTable': joinDetails.table1.id == t.id}"
                          v-for="t in ds.tables" v-bind:active="joinDetails.table2.id == t.id"
                          @click="choose(2, t)">{{t.name}}
                        </li>
                      </ul>
                    </b-collapse>
                  </td>
                </tr>
                </tbody>
              </table>
            </b-col>
            <b-col lg="6" id="selectionCol">
              <h6>Choose attributes to connect the tables</h6>
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
              <div>
                <b-button class="connectionBtns" variant="primary" @click="save"
                          v-bind:disabled="(joinDetails.editjoin.id1 === 'none') || (joinDetails.editjoin.id2 === 'none') || (!editing && joinDetails.editjoin.id !== '')">
                  Save
                </b-button>
                <DeleteButton class="connectionBtns" :on-delete="deleteConnection" v-if="joinDetails.editjoin.id !== ''" />
              </div>
            </b-col>
          </b-row>
        </div>
      </b-tab>
      <b-tab class="tabTitle" title="Visual">
        <b-row>
          <b-col cols="3">
            <table class="table connectionTable">
              <tbody>
              <tr v-for="(ds, id) in datasources">
                <td>
                <span v-b-toggle="'tablesFor3' + id" @click="expand(3, id)">
                  <b-form-checkbox @change="checkboxDs(id)"/>
                  {{ds.name}}
                  <expand-icon :expanded="(ds.id in expanded.t3)"/>
                </span>
                  <b-collapse v-bind:id="'tablesFor3' + id" class="mt-2">
                    <ul>
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
  export default {
    name: "connections",
    components: {ConnectionsVisual, Icon, ExpandIcon, DeleteButton, Loader},
    data() {
      return {
        dragDropView: true,
        expanded: {
          t1: {},
          t2: {},
          t3: {}
        },
        editing: false,
        checkboxDsState: {},
        savable: false
      }
    },
    computed: {
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
      }
    },
    created() {
      this.getJoinsAndDs()
    },
    methods: {
      getJoinsAndDs() {
        var t = this
        this.$store.dispatch('load', ['datasources', 'joins'])
          .then(() => {
            if (t.joinDetails.table1.id !== '') {
              t.choose(1, t.joinDetails.table1)
            }
          })
      },
      expand(table, id) {
        var e = this.expanded['t' + table]
        if (id in e) {
          this.$delete(e, id, true)
        } else {
          this.$set(e, id, true)
        }
      },
      save() {
        var t = this
        var toSave = {
          attributeIds: [
            t.joinDetails.editjoin.id1, t.joinDetails.editjoin.id2
          ]
        }
        if (t.joinDetails.editjoin.id === '') {
          this.$store.dispatch('create', {route: 'joins', toCreate: toSave})
            .then(() => {
              t.choose(2, t.joinDetails.table2)
            })
        } else {
          toSave.id = t.joinDetails.editjoin.id
          this.$store.dispatch('patch', {route: 'joins', toPatch: toSave})
            .then(() => {
              t.choose(2, t.joinDetails.table2)
            })
        }
      },
      deleteConnection() {
        var t = this
        this.$store.dispatch('delete', {route: 'joins', toDelete: this.joinDetails.editjoin.id})
          .then(() => {
            t.choose(2, t.joinDetails.table2)
          })
      },
      checkIfJoined(t1, t2) {
        try {
          if (this.joinsPerTable[t1][t2]) {
            return true
          }
        } catch (e) {
        }
        return false
      },
      checkboxDs(id) {
        var ds = this.datasources[id].tables
        var state = !(this.checkboxDsState[id])
        if (state === undefined) {
          state = true
        }
        for (var k in ds) {
          ds[k].visible = state
        }
        this.checkboxDsState[id] = state
      },
      choose(oneOrTwo, table) {
        this.editing = false
        var t1 = this.joinDetails.table1
        var t2 = this.joinDetails.table2
        if (oneOrTwo === 2) {
          t1 = this.joinDetails.table2
          t2 = this.joinDetails.table1
        }
        if (t2.id !== table.id) {
          this.$root.clone(t1, table)
          try {
            var j = this.joinsPerTable[t1.id][t2.id]
            if (oneOrTwo === 2) {
              this.joinDetails.editjoin.id1 = j.a2
              this.joinDetails.editjoin.id2 = j.a1
            } else {
              this.joinDetails.editjoin.id1 = j.a1
              this.joinDetails.editjoin.id2 = j.a2
            }
            this.joinDetails.editjoin.id = j.id
          } catch (e) {
            this.joinDetails.editjoin.id1 = "none"
            this.joinDetails.editjoin.id2 = "none"
            this.joinDetails.editjoin.id = ''
          }
        } else {
          if (oneOrTwo !== 2) {
            let table2 = {
              id: '',
              name: ''
            }
            this.$root.clone(this.joinDetails.table2, table2)
            this.$root.clone(this.joinDetails.table1, table)
          }
        }
      }
    }
  }
</script>

<style lang="less">
  @import "../../assets/less/colors";
  @import "../../assets/less/mixins";

  .connectionTable {
    #noUserSelect !important;
    span {
      cursor: pointer !important;
    }
    ul {
      list-style: none;
      padding-left: 0;
    }
    li {
      &:hover {
        background: lightgrey;
      }
      &[active] {
        font-weight: bold;
      }
      &.disabledTable {
        cursor: auto;
        color: gray;
        &:hover {
          background: none;
        }
      }
      cursor: pointer;
      padding-left: 1em;
    }
  }

  .isjoined {
    color: @vibGreenDarker;
  }

  #selectionCol {
    text-align: center;
    .selectNote {
      font-weight: 100;
      color: gray;
      font-style: italic;
    }
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

  .table-fade-enter-active, .table-fade-leave-active {
    transition: opacity .5s ease;
  }

  .table-fade-enter, .table-fade-leave-to
    /* .component-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }


</style>
