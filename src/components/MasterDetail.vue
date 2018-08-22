<template>
  <div>
    <b-row>
      <b-col lg="4" class="mdtable">
        <h5 class="mdtableHeader">
          <span class="tabHeading">{{theading}} ({{tclength}})</span>
          <b-button size="sm" variant="primary" @click="addNew">+</b-button>
          <update :loading="loading" :update="update" size="sm" variant="secondary"></update>
        </h5>
        <scrollable pos="twoTab">
          <Table>
            <span v-if="!loading && tclength == 0">{{$root.l.noEntries}}</span>
            <tr v-for="(t, id) in tablecontentOrdered" @click="chooseEntry(t)" :active="(t.id == activeId)">
              <td>
                <span class="tablePrimary float-left">{{t.name}}</span>
                <span class="tableSecondary float-right">{{t[secondary]}}</span>
              </td>
            </tr>
          </table>
        </scrollable>
      </b-col>
      <b-col lg="8">
        <transition name="unfold">
          <div class="mddetail" v-if="detailsVisible">
            <loader :loading="loading"/>
            <slot class="mdSlot"></slot>
          </div>
        </transition>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import Table from "./Table"

  export default {
    components: {Table},
    props: {
      route: String,
      tableheading: {
        type: String,
        default: ''
      },
      secondary: {
        type: String,
        default: ''
      },
      onItemChange: {
        type: Function,
        default() {
        }
      }
    },
    name: "masterdetail",
    methods: {
      chooseEntry(entry) {
        this.onItemChange()
        this.setDetailsVisible()
        this.$store.commit('endEditing', this.route)
        this.$store.commit('setDetailItem', {route: this.route, item: entry})
      },
      addNew() {
        this.onItemChange()
        this.setDetailsVisible()
        this.$store.commit('editing', this.route)
        this.$store.dispatch('newDetailItem', this.route)
      },
      update() {
        this.$store.dispatch('update', this.route)
      },
      setDetailsVisible() {
        this.$store.commit('setDetailsVisible', this.route)
      }
    },
    data() {
      return {}
    },
    computed: {
      tablecontent() {
        return this.$store.state[this.route] || this.$store.getters[this.route]
      },
      tclength() {
        return Object.keys(this.tablecontent).length
      },
      loading() {
        return this.$store.state.loaders[this.route]
      },
      theading() {
        return this.tableheading || this.route
      },
      detailsVisible() {
        return this.$store.state.detailsVisible[this.route]
      },
      activeId() {
        return this.$store.state.detailItem[this.route].id
      },
      tablecontentOrdered() {
        return this.$tools.sortObject(this.tablecontent, 'name')
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../style/colors";
  @import "../style/mixins";

  .mdtable {
    z-index: 2;
    background: @background;
    #noUserSelect;
    h5 {
      margin-top: 1em;
      font-size: 1.2rem;
    }
    .mdtableHeader {
      button {
        width: 2.2rem;
      }
    }
    .tablePrimary {
      font-weight: 400;
    }
    .tableSecondary {
      font-weight: 100;
      font-size: .7em;
    }
    td {
      cursor: pointer;
    }
    tr {
      &[active] {
        .tablePrimary {
          font-weight: bold;
        }
      }
      &:hover {
        background: rgba(0, 0, 0, .075);
      }
    }
    @media (max-width: 991px) {
      margin-bottom: 2em;
    }
    button {
      margin-bottom: 1em;
    }
    @media (min-width: 992px) {
      min-height: 100vh;
      border-right: 1px solid lightgrey;
    }
  }

  label {
    font-size: 1rem !important;
  }

  .mddetail {
    z-index: 1;
    padding-top: 1em;
    font-size: .9rem;
  }


</style>
