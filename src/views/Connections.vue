<template>
  <div>
    <svg id="connectionSvg" v-bind:class="{'dragging': dragged}">

      <g v-for="(t, key, ind) in tables" @mousedown="drag(t)" @mouseup="undrag()"
         :transform="'translate(' + t.x + ',' + t.y + ')'">
        <rect class="tableBorderRect" :width="tableWidth" height="50" fill="border:red" rx="15"
              ry="15"></rect>
        <text :text="t.name"></text>
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
  </div>
</template>

<script>
  export default {
    name: "Connections.vue",
    data() {
      return {
        tableWidth: 200,
        tables: {
          't1': {name: 'table1', datasourceId: '1', isVisible: true, x: 30, y: 200},
          '2': {name: 'table2', datasourceId: '1', isVisible: true, x: 200, y: 500}
        },
        dragged: false,
        draggedElement: null,
        count: 0,
        blocksInRow: 80,
        blockWidth: 10,
        currentX: 10000,
        currentY: 10000
      }
    },
    mounted() {
      // this.drag(this.tables.t1)
    },
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
        alert('undrag')
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
      }
    }
  }
</script>

<style lang="less">
  #connectionSvg {
    width: 100%;
    height: 92vh;
  }

  .tableBorderRect {
    fill: red;
    stroke-width: 3px;
    stroke: rgb(0, 0, 0);
    cursor: move; /* fallback if grab cursor is unsupported */
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
  }

  .mouseTracker {
    fill: black;
    opacity: 0;
  }

  .dragging {
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
  }


</style>
