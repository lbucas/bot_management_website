<template>
  <b-row>
    <Loader :loading="loading"/>
    <b-col lg="6" class="mdtable">
      <div class="updateKeywordsWrapper">
        <update-button class="updateKeywords" :update="updateKeywords" :loading="keywordsLoading"
                       text="Load Keywords from Datasource" size="sm"/>
      </div>
      <Pagination subroute="keywords" :id="attributeId" />
      <div class="table-responsive">
        <table class="table table-hover">
          <tbody>
          <tr v-if="keywordsCount == 0">
            <td>No keywords added yet.</td>
          </tr>
          </tbody>
          <tr v-for="(k, id) in keywordsOnPage">
            <td>
              {{k.value}}
            </td>
          </tr>
        </table>
      </div>
    </b-col>
    <b-col lg="6">
      <h6 class="selectKwHint">Select entries from the table to summarize them to one shared keyword</h6>
    </b-col>
  </b-row>
</template>

<script>
  import Loader from "../../components/Loader"
  import UpdateButton from "../../components/buttons/UpdateButton"
  import Pagination from "../../components/Pagination"

  export default {
    name: "keywords",
    components: {Pagination, UpdateButton, Loader},
    data() {
      return {}
    },
    computed: {
      keywordsLoading() {
        let l = this.$store.state.loaders.keywords[this.attributeId]
        if (l === undefined) {
          return true
        }
        return l
      },
      keywordsOnPage() {
        return this.$store.state.onPage.keywords[this.attributeId] || {}
      },
      keywordsCount() {
        return this.$store.state.loadLimitedCount.keywords[this.attributeId] || 0
      },
      loading() {
        return this.$store.state.loaders.entities
      },
      attributeId() {
        return this.$store.state.detailItem.entities.attributeId
      },
      entityId() {
        return this.$store.state.detailItem.entities.id
      },
      page() {
        return this.$store.state.page.keywords[this.attributeId]
      }
    },
    created() {
      this.loadKeywords()
    },
    methods: {
      loadKeywords() {
        this.$store.dispatch('getRouteSpecific', {subroute: 'keywords', id: this.attributeId})
      },
      updateKeywords() {
        var t = this
        this.$store.dispatch('getKeywordsFromDs', {entityId: this.entityId, attributeId: this.attributeId})
          .then(() => {
            t.loadKeywords()
          })
      }
    },
    watch: {
      attributeId(attributeId) {
        this.keywords = {}
        if (attributeId) {
          this.loadKeywords()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .updateKeywordsWrapper {
    width: 100%;
    .updateKeywords {
      float: none !important;
      margin: 1rem 0 1rem 0;
    }
  }

  .pageNavigator {
    width: 100%;
    justify-content: center;
    text-align: center;
    .back {
      float: left !important;
    }
  }

  .selectKwHint {
    margin-top: 3rem;
    text-align: center;
  }


</style>
