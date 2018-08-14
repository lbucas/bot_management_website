<template>
  <b-row id="keywords">
    <loader :loading="loading"/>
    <b-col lg="6" class="mdtable">
      <div class="updateKeywordsWrapper">
        <center-button>
          <update class="updateKeywords" :update="updateKeywords" :loading="keywordsLoading"
                         :text="l.loadKeywords" size="sm"/>
        </center-button>
      </div>
      <Pagination subroute="keywords" :id="attributeId"/>
      <Table>
        <tr v-if="keywordsCount == 0">
          <td>{{l.noKeywords}}</td>
        </tr>
        <tr v-for="(k, id) in keywordsOnPage"
            @click="$store.commit('keywordSelected', {attrId: attributeId, keyword: k})"
            :class="{'keywordCol': true, 'activeKeyword': (id in selected)}">
          <td>
            {{k.value}}
          </td>
        </tr>
      </Table>
    </b-col>
    <b-col lg="6">
      <h6 class="selectKwHint" v-show="selectedLength == 0">{{l.summarize}}</h6>
      <custom-form v-show="selectedLength > 0" :inline="false">
        <fr-input label="New Keyword Name" v-model="keywordName"/>
        <fr-blank label="Keywords to Summarize" v-show="selectedLength > 1">
          <div id="keywordsToSummarize">{{keywordsToSummarize}}</div>
        </fr-blank>
        <fr-blank label="Connected Attribute Values">
          <div id="connectedAttributeVals">{{connectedAttributeVals}}</div>
        </fr-blank>
      </custom-form>
      <save v-show="selectedLength === 1" text="Update"
                  @click="$store.dispatch('updateKeyword', attributeId)"></save>
      <save v-show="selectedLength > 1" text="Summarize"
                  @click="$store.dispatch('summarizeKeyword', attributeId)"></save>
    </b-col>
  </b-row>
</template>

<script>
  import Pagination from "../../components/Pagination"
  import Table from "../../components/Table"
  import CenterButton from "../../components/buttons/CenterButton"

  export default {
    name: "keywords",
    components: {
      CenterButton,
      Table,
      Pagination
    },
    computed: {
      l() {
        return this.$store.state.lang.entities
      },
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
      selected() {
        return this.$store.state.detailItem.keywords[this.attributeId] || {}
      },
      selectedLength() {
        return Object.keys(this.selected).length
      },
      keywordsToSummarize() {
        let kts = ''
        for (let id in this.selected) {
          kts !== '' && (kts += ', ')
          kts += "'" + this.selected[id].value + "'"
        }
        return kts
      },
      connectedAttributeVals() {
        let cav = ''
        for (let id in this.selected) {
          let s = this.selected[id]
          for (let av in s.attributeValues) {
            cav !== '' && (cav += ', ')
            cav += "'" + s.attributeValues[av].value + "'"
          }
        }
        return cav
      },
      keywordName: {
        get() {
          return this.$store.state.keywordName[this.attributeId] || ''
        },
        set: function (newValue) {
          this.$store.commit('keywordName', {newValue, attrId: this.attributeId})
        }
      }
    },
    created() {
      this.loadKeywords()
    },
    methods: {
      loadKeywords(forceReload) {
        this.$store.dispatch('getRouteSpecific', {subroute: 'keywords', id: this.attributeId, forceReload: forceReload})
      },
      async updateKeywords() {
        await this.$store.dispatch('getKeywordsFromDs', {entityId: this.entityId, attributeId: this.attributeId})
        this.loadKeywords(true)
      }
    },
    watch: {
      attributeId(attributeId) {
        this.keywords = {}
        attributeId && this.loadKeywords()
      },
      selectedLength(l, old) {
        if (l === 1) {
          this.keywordName = this.selected[Object.keys(this.selected)[0]].value
        } else if (old === 1) {
          this.keywordName = ''
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../style/mixins';

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

  .keywordCol {
    #tableSelectable;
    #noUserSelect;
    &.activeKeyword {
      font-weight: bold;
    }
  }

  #connectedAttributeVals {
    max-height: 30vh;
    overflow-y: auto;
  }


</style>
