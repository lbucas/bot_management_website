<template>
  <div>
    <b-row>
      <b-col lg="4" class="mdtable">
        <h5 class="mdtableHeader">
          <span class="tabHeading">{{theading}} ({{tlength}})</span>
          <b-button size="sm" variant="primary" @click="addNew">+</b-button>
          <UpdateButton :loading="loading" :update="update" size="sm" variant="secondary"></UpdateButton>
        </h5>
        <div class="table-responsive">
          <table class="table table-hover">
            <span v-if="!loading && tclength == 0">There's nothing to show.</span>
            <tr v-for="(t, id) in tablecontent" @click="chooseEntry(t)" v-bind:active="(id == activeId)">
              <td>
                <span class="tablePrimary float-left">{{t.name}}</span>
                <span class="tableSecondary float-right">{{t[secondary]}}</span>
              </td>
            </tr>
          </table>
        </div>
      </b-col>
      <b-col lg="8">
        <transition name="unfold">
          <div class="mddetail" v-if="detailsVisible">
            <Loader :loading="loading"/>
            <slot class="mdSlot"></slot>
          </div>
        </transition>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import UpdateButton from "./buttons/UpdateButton"
  import Loader from "./Loader"

  export default {
    components: {UpdateButton, Loader},
    props: {
      route: String,
      tableheading: {
        type: String,
        default: ''
      },
      secondary: {
        type: String,
        default: ''
      }
    },
    name: "masterdetail",
    methods: {
      chooseEntry(entry) {
        this.setDetailsVisible()
        this.$store.commit('endEditing', this.route)
        this.$store.commit('setDetailItem', {route: this.route, item: entry})
      },
      addNew() {
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
        return this.$store.state[this.route]
      },
      tclength() {
        return Object.keys(this.tablecontent).length
      },
      loading() {
        return this.$store.state.loaders[this.route]
      },
      theading() {
        let th = this.$props.tableheading
        if (!th) {
          th = this.$props.route
        }
        return th
      },
      detailsVisible() {
        let route = this.route
        return this.$store.state.detailsVisible[route]
      },
      activeId() {
        return this.$store.state.detailItem[this.route].id
      },
      tlength() {
        return Object.keys(this.tablecontent).length
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../assets/less/colors";
  @import "../assets/less/mixins";

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
  @media-bottom (max-width: 991 px) {
    margin-bottom: 2em;
  }
    button {
      margin-bottom: 1em;
    }
    @media (min-width: 992px) {
      min-height: 93vh;
      border-right: 1px solid lightgrey;
    }
  }

  label {
    font-size: 1rem !important;
  }

  .mddetail {
    z-index: 1;
    padding-top: 1em;
    font-size: .9rem
  }


</style>
