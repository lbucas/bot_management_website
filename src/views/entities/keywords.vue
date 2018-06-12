<template>
  <b-row>
    <b-col lg="4" class="mdtable">
      <div class="table-responsive">
        <table class="table table-hover">
          <span v-if="!isLoading && keywordsIndex.length == 0">No keywords added yet.</span>
          <tr v-for="(k, id) in keywordsOnPage" >
            <td>
              {{k.name}}
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
</template>

<script>
  const entriesPerPage = 10
  export default {
    name: "keywords",
    props: {
      loading: {
        type: Boolean,
        default: false
      },
      attributeId: String
    },
    data() {
      return {
        page: 1,
        keywords: {}
      }
    },
    computed: {
      keywordsLoading() {
        return this.$store.state.loaders.keywords
      },
      keywordsIndex() {
        let index = []
        for (let key in this.keywords) { index.push(key) }
      },
      keywordsOnPage() {
        let kop = {}
        let k
        for (let i = ((this.page - 1) * entriesPerPage); i < this.page * entriesPerPage; i++) {
          k = this.keywordsIndex[i]
          kop[i] = this.keywords[i]
        }
        return kop
      },
      isLoading() {
        return this.loading || this.keywordsLoading
      }
    },
    created() {
    },
    methods: {},
    watch: {
      attributeId(attributeId) {
        var t = this
        this.keywords = []
        this.$store.dispatch('getKeywords', {attributeId, forceUpdate: false})
          .then((data) => {
            t.$root.clone(t.keywords, data)
          })
      }
    }
  }
</script>

<style scoped>

</style>
