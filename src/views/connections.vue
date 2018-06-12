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
                            v-bind:active="table1.id == t.id">
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
                          v-bind:class="{'isjoined': checkIfJoined(table1.id, t.id), 'disabledTable': table1.id == t.id}"
                          v-for="t in ds.tables" v-bind:active="table2.id == t.id"
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
                  <span class="selectNote" v-if="table1.name == ''">Please choose a table from the left side</span>
                  <span v-if="!(table1.name == '')">{{table1.name}}</span>
                  <select class="form-control" v-if="!((table1.name == '') || (table2.name == ''))"
                          v-model="editjoin.id1"
                          v-bind:disabled="!editing && editjoin.id !== ''">
                    <option value="none"></option>
                    <option v-for="a in table1.attributes" v-bind:value="a.id">{{a.name}} ({{a.datatype}})</option>
                  </select>
                </b-col>
                <b-col cols="1">
                  <img class="controlicon" src="../assets/icons/arrowtwoway.svg"/>
                  <button v-if="!editing && editjoin.id !== ''" @click="editing = true" type="button"
                          id="editConnection" class="close">×
                  </button>
                </b-col>
                <b-col class="text-center">
                  <span class="selectNote" v-if="table2.name == ''">Please choose a table from the right side</span>
                  <span v-if="!(table2.name == '')">{{table2.name}}</span>
                  <select class="form-control" v-if="!((table1.name == '') || (table2.name == ''))"
                          v-model="editjoin.id2"
                          v-bind:disabled="!editing && editjoin.id !== ''">
                    <option value="none"></option>
                    <option v-for="a in table2.attributes" v-bind:value="a.id">{{a.name}} ({{a.datatype}})</option>
                  </select>
                </b-col>
              </b-row>
              <div>
                <b-button class="connectionBtns" variant="primary" @click="save"
                          v-bind:disabled="(editjoin.id1 === 'none') || (editjoin.id2 === 'none') || (!editing && editjoin.id !== '')">
                  Save
                </b-button>
                <DeleteButton class="connectionBtns" :on-delete="deleteConnection" v-if="editjoin.id !== ''" />
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
            <svg id="connectionSvg" v-bind:class="{'dragging': dragged}" @mouseup="undrag()" @mousemove="currentXY">
              <line class="joinline" v-for="(j,id) in joins"
                    v-if="tables[j.t1].visible && tables[j.t2].visible"
                    :x1="tables[j.t1].x + tableWidth/2"
                    :x2="tables[j.t2].x + tableWidth/2" :y1="tables[j.t1].y +tableHeight/2"
                    :y2="tables[j.t2].y +tableHeight/2" v-bind:active="id == hoverline"/>
              <line class="joinlinemouseover" v-for="(j, id) in joins"
                    v-if="tables[j.t1].visible && tables[j.t2].visible"
                    :x1="tables[j.t1].x + tableWidth/2"
                    :x2="tables[j.t2].x + tableWidth/2" :y1="tables[j.t1].y +tableHeight/2"
                    :y2="tables[j.t2].y +tableHeight/2" @mouseover="moLine(id)" @mouseout="moLine('')"/>

              <g v-for="(t, key, ind) in tables"
                 :transform="'translate(' + t.x + ',' + t.y + ')'"
                 v-bind:class="{'dragging': dragged, 'draggable': !dragged}"
                 :style="'z-index: ' + ind" v-if="t.visible">
                <rect class="tableBorderRect" :width="tableWidth" :height="tableHeight"
                      fill="border:red" rx="15" :class="getDsColor(t.datasourceId)"
                      ry="15"></rect>
                <g class="textGroup" :width="tableWidth" :height="tableHeadingHeight"
                   :transform="'translate(' + tableWidth/2 + ',' + getYTranslation(tableHeadingHeight) + ')'">
                  <text class="tableName" :class="getDsColor(t.datasourceId)">{{t.name}}</text>
                </g>
                <g @mousedown="drag(t)" @mouseup="undrag()">
                  <rect class="dragDetector" :width="tableWidth" :height="tableHeight"/>
                </g>
              </g>
            </svg>
          </b-col>
        </b-row>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
  import Loader from "../components/Loader"
  import DeleteButton from "../components/buttons/DeleteButton"
  import ExpandIcon from "../components/ExpandIcon"
  export default {
    name: "connections",
    components: {ExpandIcon, DeleteButton, Loader},
    data() {
      return {
        tableWidth: 120, // this.$refs.dragDrop.clientWidth,
        tableHeight: 50, // this.$refs.dragDrop.clientHeight,
        tableHeadingHeight: 20,
        dragged: false,
        draggedElement: null,
        count: 0,
        blocksInRow: 90,
        blockWidth: 10,
        currentX: 10000,
        currentY: 10000,
        hoverline: '',
        dsColors: {},
        dragDropView: true,
        expanded: {
          t1: {},
          t2: {},
          t3: {}
        },
        table1: {
          id: '',
          name: ''
        },
        table2: {
          id: '',
          name: ''
        },
        editing: false,
        checkboxDsState: {},
        editjoin: {
          id1: "none",
          id2: "none",
          id: ''
        },
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
            if (t.table1.id !== '') {
              t.choose(1, t.table1)
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
            t.editjoin.id1, t.editjoin.id2
          ]
        }
        if (t.editjoin.id === '') {
          this.$store.dispatch('create', {route: 'joins', toCreate: toSave})
            .then(() => {
              t.choose(2, t.table2)
            })
        } else {
          toSave.id = t.editjoin.id
          this.$store.dispatch('patch', {route: 'joins', toPatch: toSave})
            .then(() => {
              t.choose(2, t.table2)
            })
        }
      },
      deleteConnection() {
        var t = this
        debugger
        this.$store.dispatch('delete', {route: 'joins', toDelete: this.editjoin.id})
          .then(() => {
            t.choose(2, t.table2)
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
        var t1 = this.table1
        var t2 = this.table2
        if (oneOrTwo === 2) {
          t1 = this.table2
          t2 = this.table1
        }
        if (t2.id !== table.id) {
          this.$root.clone(t1, table)
          try {
            var j = this.joinsPerTable[t1.id][t2.id]
            if (oneOrTwo === 2) {
              this.editjoin.id1 = j.a2
              this.editjoin.id2 = j.a1
            } else {
              this.editjoin.id1 = j.a1
              this.editjoin.id2 = j.a2
            }
            this.editjoin.id = j.id
          } catch (e) {
            this.editjoin.id1 = "none"
            this.editjoin.id2 = "none"
            this.editjoin.id = ''
          }
        } else {
          if (oneOrTwo !== 2) {
            let table2 = {
              id: '',
              name: ''
            }
            this.$root.clone(this.table2, table2)
            this.$root.clone(this.table1, table)
          }
        }
      },
      // SVG handlers
      move(x, y) {
        if (this.dragged) {
          this.draggedElement.x = event.offsetX - this.tableWidth / 2
          this.draggedElement.y = event.offsetY
        }
      },
      drag(t) {
        this.draggedElement = t
        this.dragged = true
      },
      undrag() {
        this.draggedElement = null
        this.dragged = false
      },
      currentXY(event) {
        console.log(event)
        let x = event.layerX
        let y = event.layerY
        this.currentX = x
        this.currentY = y
        if (this.dragged) {
          this.draggedElement.x = x - this.tableWidth / 2
          this.draggedElement.y = y
        }
      },
      getYTranslation(height) {
        return height + 8
      },
      moLine(id) {
        this.hoverline = id
      },
      getDsColor(dsid) {
        let c = this.dsColors[dsid]
        if (c === undefined) {
          c = 'color' + (Object.keys(this.dsColors).length % 12 + 1)
          this.dsColors[dsid] = c
        }
        return c
      }
    }
  }
</script>

<style lang="less">
  @import "../assets/less/colors";
  @import "../assets/less/mixins";

  #connectionTabs {
    .nav-tabs {
      margin-bottom: .5em;
    }
  }

  #connectionSvg {
    width: 100%;
    height: 92vh;
  }

  .mouseTracker {
    fill: black;
    opacity: 0;
  }

  .draggable {
    #dragCursor
  }

  .dragging {
    #draggingCursor
  }

  .tableName {
    font: 1em @font;
    fill: black;
    #noUserSelect;
    user-select: none;
    &.color1, &.color2, &.color4, &.color4{
      fill: white;
    }
  }

  .textGroup {
    text-anchor: middle;
  }

  .dragDetector {
    fill: white;
    opacity: .00001;
  }

  .joinline {
    stroke: #b3b3b3;
    stroke-width: 1px;
    transition: stroke-width 300ms;
    &[active] {
      stroke-width: 5px;
    }
  }

  .joinlinemouseover {
    stroke: white;
    stroke-width: 20px;
    opacity: .00001;
    &:hover {
      cursor: pointer;
    }
  }

  .tableBorderRect {
    stroke: black;
    &.color1 {
      fill: @richPurple;
    }

    &.color2 {
      fill: @richGreen
    }

    &.color3 {
      fill: @richBlue
    }

    &.color4 {
      fill: @richRed
    }

    &.color5 {
      fill: @vibCyan
    }

    &.color6 {
      fill: @vibGreen

    }

    &.color7 {
      fill: @vibMagenta
    }

    &.color8 {
      fill: @vibYellow

    }

    &.color9 {
      fill: @senBlue

    }

    &.color10 {
      fill: @senGreen
    }

    &.color11 {
      fill: @senYellow
    }

    &.color12 {
      fill: @senPink
    }
  }

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
