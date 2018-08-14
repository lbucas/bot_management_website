<template>
  <b-col class="text-center">
    <div v-if="table">
      <span>{{table.name}}</span>
      <select class="form-control" v-model="attributeId" :disabled="disabled">
        <option value="null"></option>
        <option v-for="a in table.attributes" :value="a.id">{{a.name}} ({{a.datatype}})
        </option>
      </select>
    </div>
    <span v-else class="selectNote">{{chooseATable}}</span>

  </b-col>
</template>

<script>
  export default {
    name: "AttributeSelect",
    props: {
      value: {},
      left: Boolean,
      tableId: {
        default: null
      },
      disabled: Boolean
    },
    computed: {
      attributeId: {
        get() {
          return this.value
        },
        set(v) {
          this.$emit("input", v)
        }
      },
      chooseATable() {
        return this.left ? this.$root.l.leftSide : this.$root.l.rightSide
      },
      table() {
        return this.tableId ? this.$store.getters.tables[this.tableId] : null
      }
    }
  }
</script>

<style scoped>
  .selectNote {
    font-weight: 100;
    color: gray;
    font-style: italic;
  }

</style>
