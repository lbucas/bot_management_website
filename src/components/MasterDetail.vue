<template>
  <div>
    <b-row>
      <b-col lg="4" class="mdtable">
        <h5>
          <span class="tabHeading">{{tableheading}}</span>
          <b-button size="sm" variant="primary" @click="addNewWrapper">+</b-button>
          <UpdateButton :loading="loading" :update="update" size="sm" variant="secondary"></UpdateButton>
        </h5>
        <div class="table-responsive">
          <table class="table table-hover">
            <span v-if="!loading && tclength == 0">There's nothing to show.</span>
            <tr v-for="(t, id) in tablecontent" @click="chooseEntry(id)" v-bind:active="(id == activeId)">
              <td>
                <span class="tablePrimary float-left">{{t.name}}</span>
                <span class="tableSecondary float-right">{{t[secondary]}}</span>
              </td>
            </tr>
          </table>
        </div>
      </b-col>
      <b-col lg="8">
        <div class="mddetail" v-if="detailsVisible">
          <Loader :loading="loading"/>
          <slot></slot>
        </div>
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
      'tableheading': String,
      'tablecontent': Object,
      'addnew': Function,
      'update': Function,
      'selected': Function,
      'manualchoose': String,
      'secondary': {
        type: String,
        default: ''
      },
      'loading': Boolean
    },
    name: "masterdetail",
    methods: {
      chooseEntry(id) {
        this.activeId = id
        this.detailsVisible = true
        this.$props.selected(this.tablecontent[id])
      },
      addNewWrapper() {
        this.detailsVisible = true
        this.activeId = ''
        this.$props.addnew()
      }
    },
    data() {
      return {
        activeId: '',
        detailsVisible: false
      }
    },
    computed: {
      tclength() {
        return Object.keys(this.tablecontent).length
      }
    },
    watch: {
      manualchoose(id) {
        if (id !== '') {
          this.chooseEntry(id)
        } else {
          this.detailsVisible = false
        }
      }
    }
  }
</script>

<style lang="less">
  @richPurple: #503291;

  .mdtable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    h5 {
      margin-top: 1em;
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
        background: rgba(0,0,0,.075);
      }
    }
  @media-bottom (max-width: 991px) {
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

  .mddetail {
    padding-top: 1em;
  }


</style>
