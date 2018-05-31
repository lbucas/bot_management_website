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
                <tr v-for="(ds, id) in tables">
                  <td>
                <span v-b-toggle="'tablesFor1' + id" @click="expand(1, id)">
                  <img v-if="!(id in expanded.t1)" class="controlicon" src="../assets/icons/expand-button.svg"/>
                  <img v-if="(id in expanded.t1)" class="controlicon" src="../assets/icons/expand-arrow.svg"/>
                  {{ds.name}}
                </span>
                    <b-collapse v-bind:id="'tablesFor1' + id" class="mt-2">
                      <ul>
                        <li v-for="t in ds.tables" @click="choose(1, t)"
                            v-bind:active="table1.id == t.id"
                            v-bind:class="{'disabledTable': table2.id == t.id}">
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
                <tr v-for="(ds, id) in tables">
                  <td>
                <span v-b-toggle="'tablesFor2' + id" @click="expand(2, id)">
                  <img v-if="!(id in expanded.t2)" class="controlicon" src="../assets/icons/expand-button.svg"/>
                  <img v-if="(id in expanded.t2)" class="controlicon" src="../assets/icons/expand-arrow.svg"/>
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
              <h6>Choose attributes to connect</h6>
              <b-row>
                <b-col class="text-center">
                  <span class="selectNote" v-if="table1.name == ''">Please choose</span>
                  <span v-if="!(table1.name == '')">{{table1.name}}</span>
                  <select class="form-control" v-if="!((table1.name == '') || (table2.name == ''))"
                          v-model="editjoin.id1"
                          v-bind:disabled="!editing && editjoin.joinId !== ''">
                    <option value="none"></option>
                    <option v-for="a in table1.attributes" v-bind:value="a.id">{{a.name}}</option>
                  </select>
                </b-col>
                <b-col cols="1">
                  <img class="controlicon" src="../assets/icons/arrowtwoway.svg"/>
                  <button v-if="!editing && editjoin.joinId !== ''" @click="editing = true" type="button"
                          id="editConnection" class="close">×
                  </button>
                </b-col>
                <b-col class="text-center">
                  <span class="selectNote" v-if="table2.name == ''">Please choose</span>
                  <span v-if="!(table2.name == '')">{{table2.name}}</span>
                  <select class="form-control" v-if="!((table1.name == '') || (table2.name == ''))"
                          v-model="editjoin.id2"
                          v-bind:disabled="!editing && editjoin.joinId !== ''">
                    <option value="none"></option>
                    <option v-for="a in table2.attributes" v-bind:value="a.id">{{a.name}}</option>
                  </select>
                </b-col>
              </b-row>
              <div>
                <b-button id="saveConnection" variant="primary" @click="save"
                          v-bind:disabled="(editjoin.id1 === 'none') || (editjoin.id2 === 'none') || (!editing && editjoin.joinId !== '')">
                  Save
                </b-button>
                <b-button id="saveConnection" variant="danger" @click="deleteConnection" v-if="editjoin.joinId !== ''">
                  Delete Connection
                </b-button>
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
              <tr v-for="(ds, id) in tables">
                <td>
                <span v-b-toggle="'tablesFor3' + id" @click="expand(3, id)">
                  <b-form-checkbox @change="checkboxDs(id)"/>
                  {{ds.name}}
                  <img v-if="!(id in expanded.t3)" class="controlicon" src="../assets/icons/expand-button.svg"/>
                  <img v-if="(id in expanded.t3)" class="controlicon" src="../assets/icons/expand-arrow.svg"/>
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
            <svg id="connectionSvg" v-bind:class="{'dragging': dragged}" @mouseup="undrag()">

              <line class="joinline" v-for="(j,id) in joins"
                    v-if="tables[j.d1].tables[j.t1].visible && tables[j.d2].tables[j.t2].visible"
                    :x1="tables[j.d1].tables[j.t1].x + tableWidth/2"
                    :x2="tables[j.d2].tables[j.t2].x + tableWidth/2" :y1="tables[j.d1].tables[j.t1].y +tableHeight/2"
                    :y2="tables[j.d2].tables[j.t2].y +tableHeight/2" v-bind:active="id == hoverline"/>
              <line class="joinlinemouseover" v-for="(j, id) in joins"
                    v-if="tables[j.d1].tables[j.t1].visible && tables[j.d2].tables[j.t2].visible"
                    :x1="tables[j.d1].tables[j.t1].x + tableWidth/2"
                    :x2="tables[j.d2].tables[j.t2].x + tableWidth/2" :y1="tables[j.d1].tables[j.t1].y +tableHeight/2"
                    :y2="tables[j.d2].tables[j.t2].y +tableHeight/2" @mouseover="moLine(id)" @mouseout="moLine('')"/>

              <g v-for="(t, key, ind) in svgTables"
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
              <g>
                <g v-for="i in (blocksInRow*blocksInRow)">
                  <rect :width="blockWidth" :height="blockWidth" :x="(i%blocksInRow)*blockWidth"
                        :y="(Math.floor(i/blocksInRow))*blockWidth" class="mouseTracker"
                        v-if="currentY != (Math.floor(i/blocksInRow))*blockWidth || currentX != (i%blocksInRow)*blockWidth"
                        @mouseover="currentXY((i%blocksInRow)*blockWidth, (Math.floor(i/blocksInRow))*blockWidth)"></rect>
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

  export default {
    name: "Connections.vue",
    components: {Loader},
    data() {
      return {
        tableWidth: 120, // this.$refs.dragDrop.clientWidth,
        tableHeight: 50, // this.$refs.dragDrop.clientHeight,
        tableHeadingHeight: 20,
        tables: {},
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
          't1': {},
          't2': {},
          't3': {}
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
          joinId: ''
        },
        savable: false,
        connectionLoading: true
      }
    },
    mounted() {
      this.getTables()
    },
    methods: {
      getTables() {
        var t = this
        t.connectionLoading = true
        this.$root.getAndSet(
          'projects/--projectid--/datasources',
          t.tables,
          function (data) {
            for (var k in data) {
              data[k].tables = t.$root.arrayToObject(data[k].tables)
              for (var id in data[k].tables) {
                data[k].tables[id].datasourceId = k
                data[k].tables[id].x = Math.floor(Math.random() * Math.floor(600))
                data[k].tables[id].y = Math.floor(Math.random() * Math.floor(500))
                data[k].tables[id].visible = false
              }
            }
            return data
          },
          function () {
            t.connectionLoading = false
            if (t.table1.id !== '') {
              t.choose(1, t.table1)
            }
          },
          {
            filter: {
              "include": {
                "relation": "tables",
                "scope": {
                  "include": [{
                    "relation": "joins",
                    "scope": {"include": {"relation": "attributes", "scope": {"fields": ["id", "tableId"]}}}
                  }, {"relation": "attributes"}]
                }
              }
            }
          }
        )
      },
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
      currentXY(x, y) {
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
        t.connectionLoading = true
        this.$root.post(
          'joins',
          {
            "attributeIds": [
              t.editjoin.id1, t.editjoin.id2
            ]
          },
          function (d) {
            t.getTables()
          }
        )
      },
      deleteConnection() {
        var t = this
        this.$root.delete(
          'joins/',
          t.editjoin.joinId,
          function () {
            t.getTables()
          }
        )
      },
      checkIfJoined(t1, t2) {
        try {
          if (this.joinPerTable[t1][t2]) {
            return true
          }
        } catch (e) {
        }
        return false
      },
      checkboxDs(id) {
        var ds = this.tables[id].tables
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
            var j = this.joinPerTable[t1.id][t2.id]
            if (oneOrTwo === 2) {
              this.editjoin.id1 = j.a2
              this.editjoin.id2 = j.a1
            } else {
              this.editjoin.id1 = j.a1
              this.editjoin.id2 = j.a2
            }
            this.editjoin.joinId = j.joinId
          } catch (e) {
            this.editjoin.id1 = "none"
            this.editjoin.id2 = "none"
            this.editjoin.joinId = ''
          }
        }
      }
    },
    computed: {
      svgTables() {
        var t
        var tables = {}
        for (var ds in this.tables) {
          t = this.tables[ds].tables
          for (var tab in t) {
            tables[tab] = t[tab]
          }
        }
        return tables
      },
      joins() {
        var getId = function (id1, id2) {
          if (id1 > id2) {
            return id1 + id2
          } else {
            return id2 + id1
          }
        }
        var joins = {}
        var ds
        var join
        var jid
        var joinids
        var ownAttr
        for (var id in this.tables) {
          ds = this.tables[id]
          for (var tid in ds.tables) {
            join = ds.tables[tid].joins || []
            for (let i = 0; i < join.length; i++) {
              joinids = join[i].attributeIds
              jid = getId(joinids[0], joinids[1])
              for (let a = 0; a < join[i].attributes.length; a++) {
                if (join[i].attributes[a].tableId === tid) {
                  ownAttr = join[i].attributes[a].id
                }
              }
              if (joins[jid] === undefined) {
                joins[jid] = {
                  t1: tid,
                  t2: '',
                  d1: id,
                  d2: '',
                  a1: ownAttr,
                  a2: '',
                  joinId: join[i].id
                }
              } else {
                joins[jid].t2 = tid
                joins[jid].d2 = id
                joins[jid].a2 = ownAttr
              }
            }
          }
        }
        return joins
      },
      joinPerTable() {
        var jpt = {}
        var j
        for (var jid in this.joins) {
          j = this.joins[jid]
          if (!jpt[j.t1]) {
            jpt[j.t1] = {}
          }
          if (!jpt[j.t2]) {
            jpt[j.t2] = {}
          }
          jpt[j.t1][j.t2] = j
          let jSwapped = {
            t1: j.t2,
            t2: j.t1,
            d1: j.d2,
            d2: j.d1,
            a1: j.a2,
            a2: j.a1,
            joinId: j.id
          }
          jpt[j.t2][j.t1] = jSwapped
        }
        return jpt
      }
    }
  }
</script>

<style lang="less">
  @import "../assets/ci/ci";

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
    cursor: move; /* fallback if grab cursor is unsupported */
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
  }

  .dragging {
    cursor: grabbing !important;
    cursor: -moz-grabbing !important;
    cursor: -webkit-grabbing !important;
  }

  .tableName {
    font: 1em @font;
    fill: black;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    &.color1 {
      fill: white;
    }
    &.color2 {
      fill: white;
    }
    &.color3 {
      fill: white;
    }
    &.color4 {
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
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    span {
      cursor: pointer;
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
    .selectNote {
      font-weight: 100;
      color: gray;
      font-style: italic;
    }
    select {
      margin-top: .5em;
    }
    #saveConnection {
      margin-top: 1em;
    }
    #editConnection {
      margin-top: .5em;
    }
  }

  .table-fade-enter-active, .table-fade-leave-active {
    transition: opacity .5s ease;
  }

  .table-fade-enter, .table-fade-leave-to
    /* .component-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }


</style>
