<template>
  <div>
    <b-row>
      <b-col lg="4" class="mdtable">
        <h5>
          <span class="tabHeading">{{tableheading}}</span>
          <b-button size="sm" variant="primary" @click="addnew">+</b-button>
        </h5>
        <div class="table-responsive">
          <table class="table table-hover">
            <slot name="table"></slot>
          </table>
        </div>
      </b-col>
      <b-col lg="8">
        <div class="mddetail">
          <slot name="detail"></slot>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  export default {
    props: {
      'tableheading': String,
      'addnew': Function
    },
    name: "masterdetail"
  }
</script>

<style lang="less">
  @richPurple: #503291;

  .mdtable {
    overflow-scrolling: auto;
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
    }
  @media-bottom (max-width: 991px) {
    margin-bottom: 2em;
  }
    button {
      margin-bottom: 1em;
    }
    @media (min-width: 992px) {
      border-right: 1px solid lightgrey;
    }
  }

  .mddetail {
    padding-top: 1em;
  }


</style>
