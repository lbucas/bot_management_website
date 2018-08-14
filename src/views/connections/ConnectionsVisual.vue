<template>
  <div>
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
          :y2="tables[j.t2].y +tableHeight/2" @mouseover="moLine(id)" @mouseout="moLine('')" @click="editConnection(id)"/>

    <g v-for="(t, key, ind) in tables"
       :transform="'translate(' + t.x + ',' + t.y + ')'"
       v-bind:class="{'dragging': dragged, 'draggable': !dragged}"
       :style="'z-index: ' + ind" v-if="t.visible">
      <rect class="tableBorderRect" :width="tableWidth" :height="tableHeight"
            fill="border:red" rx="15" :class="getDsColor(t.datasourceId)"
            ry="15"></rect>
      <g class="textGroup" :width="tableWidth" :height="tableHeadingHeight"
         :transform="'translate(' + tableWidth/2 + ',' + getYTranslation(tableHeadingHeight) + ')'">
        <text class="tableName" :class="getDsColor(t.datasourceId)">{{t.displayName}}</text>
      </g>
      <g @mousedown="drag(t)" @mouseup="undrag()">
        <rect class="dragDetector" :width="tableWidth" :height="tableHeight"/>
      </g>
    </g>
  </svg>
    <b-modal size="lg" id="editConnection" title="Edit the connection">
      <connection-edit/>
    </b-modal>
  </div>
</template>

<script>
  import ConnectionEdit from "./ConnectionEdit"
  export default {
    name: "ConnectionsVisual",
    components: {ConnectionEdit},
    props: {},
    data() {
      return {
        tableWidth: 120, // this.$refs.dragDrop.clientWidth,
        tableHeight: 50, // this.$refs.dragDrop.clientHeight,
        tableHeadingHeight: 20,
        dragged: false,
        draggedElement: null,
        count: 0,
        currentX: 10000,
        currentY: 10000,
        hoverline: '',
        dsColors: {}
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
      joinDetails() {
        return this.$store.state.detailItem.joins
      }
    },
    created() {},
    methods: {
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
      },
      editConnection(id) {
        this.joinDetails.editjoin = this.joins[id]
        this.$root.modalOpen('editConnection')
      }
    },
    watch: {}
  }
</script>

<style lang="less" scoped>
  @import "../../style/colors";
  @import "../../style/mixins";

  #connectionTabs {
    .nav-tabs {
      margin-bottom: .5em;
    }
  }

  #connectionSvg {
    width: 100%;
    height: 92vh;
  }

  .draggable {
    #dragCursor
  }

  .dragging {
    #draggingCursor
  }

  .tableName {
    font: .7em @font;
    fill: black;
    #noUserSelect;
    user-select: none;
    &.color1, &.color2, &.color3, &.color4 {
      fill: white;
    }
  }

  .textGroup {
    text-anchor: middle;
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

  .dragDetector {
    fill: white;
    opacity: .00001;
  }

</style>
