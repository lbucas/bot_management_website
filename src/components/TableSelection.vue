<template>
  <b-col>
    <table class="table connectionTable">
      <tbody>
      <tr v-for="(ds, id) in datasources">
        <td>
          <span v-b-toggle="(cid + 'tables' + id)" @click="expand(2, id)">
            <expand-icon :expanded="(id in expanded)"/>
            {{ds.name}}
          </span>
          <b-collapse :id="(cid + 'tables' + id)" class="mt-2">
            <ul>
              <li v-for="(t, tid) in ds.tables" :class="{'isjoined': (tid in joined), 'disabledTable': tid == disabled}"
                :active="tableId == tid" @click="tableId = tid">
                  {{t.displayName}}
              </li>
            </ul>
          </b-collapse>
        </td>
      </tr>
      </tbody>
    </table>
  </b-col>
</template>

<script>
  import ExpandIcon from "./ExpandIcon"
  export default {
    name: "TableSelection",
    components: {ExpandIcon},
    props: {
      value: {},
      joined: {
        type: Object,
        default() {
          return {}
        }
      },
      disabled: {
        default: null
      },
      id: String
    },
    data() {
      return {
        expanded: {}
      }
    },
    computed: {
      tableId: {
        get() {
          if (this.value == this.disabled && this.disabled) { // eslint-disable-line eqeqeq
            this.$emit("input", null)
          } else {
            return this.value
          }
        },
        set(v) {
          this.$emit("input", v)
        }
      },
      cid() {
        return this._uid
      },
      datasources() {
        return this.$store.state.datasources
      }
    },
    created() {
    },
    methods: {
      expand(table, id) {
        if (id in this.expanded) {
          this.$delete(this.expanded, id)
        } else {
          this.$set(this.expanded, id, true)
        }
      }
    },
    watch: {}
  }
</script>

<style lang="less" scoped>
  @import "../assets/less/mixins";
  @import "../assets/less/colors";

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
        color: black !important;
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


</style>
