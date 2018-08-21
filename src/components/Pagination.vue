<template>
  <div class="pageNavigator" v-if="!loading && totalPages > 1">
    <b-button variant="outline-secondary" class="back" size="sm" v-if="page> 1" @click="pageTurn(false)" outline>←</b-button>
    {{$root.l.page}} {{page}} {{$root.l.of}} {{totalPages}}
    <b-button variant="outline-secondary" size="sm" v-if="page < totalPages" @click="pageTurn(true)">→</b-button>
  </div>

</template>

<script>
  export default {
    name: "Pagination",
    props: {
      id: Number,
      subroute: String
    },
    computed: {
      page() {
        return this.$store.state.page[this.subroute][this.id]
      },
      count() {
        return this.$store.state.loadLimitedCount[this.subroute][this.id]
      },
      totalPages() {
        return Math.ceil(this.count / this.$store.state.entriesPerPage)
      },
      loading() {
        return this.$store.state.loaders[this.subroute][this.id]
      }
    },
    methods: {
      pageTurn(forward) {
        this.$store.dispatch('page', {subroute: this.subroute, id: this.id, forward})
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../style/mixins";
  .pageNavigator {
    width: 100%;
    justify-content: center;
    text-align: center;
    #noUserSelect;
  .back {
    float: left !important;
  }
  }

</style>
