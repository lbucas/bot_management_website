<template>
  <b-row id="keywords">
    <Loader :loading="loading"/>
    <b-col lg="6" class="mdtable">
      <div class="updateKeywordsWrapper">
        <CenterButton>
          <update-button class="updateKeywords" :update="updateKeywords" :loading="keywordsLoading"
                         text="Load Keywords from Datasource" size="sm"/>
        </CenterButton>
      </div>
      <Pagination subroute="keywords" :id="attributeId"/>
      <Table>
        <tr v-if="keywordsCount == 0">
          <td>No keywords added yet.</td>
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
      <h6 class="selectKwHint" v-show="selectedLength == 0">Select entries from the table to rename them or to summarize
        multiple to one shared keyword</h6>
      <CustomForm v-show="selectedLength > 0" :inline="false">
        <FormRowInput label="New Keyword Name" v-model="keywordName"/>
        <FormRowBlank label="Keywords to Summarize" v-show="selectedLength > 1">
          <div id="keywordsToSummarize">{{keywordsToSummarize}}</div>
        </FormRowBlank>
        <FormRowBlank label="Connected Attribute Values">
          <div id="connectedAttributeVals">{{connectedAttributeVals}}</div>
        </FormRowBlank>
      </CustomForm>
      <SaveButton v-show="selectedLength === 1" text="Update"
                  @click="$store.dispatch('updateKeyword', attributeId)"></SaveButton>
      <SaveButton v-show="selectedLength > 1" text="Summarize"
                  @click="$store.dispatch('summarizeKeyword', attributeId)"></SaveButton>
    </b-col>
  </b-row>
</template>

<script>
  import Loader from "../../components/Loader"
  import UpdateButton from "../../components/buttons/UpdateButton"
  import Pagination from "../../components/Pagination"
  import CustomForm from "../../components/form/CustomForm"
  import FormRowInput from "../../components/form/FormRowInput"
  import FormRowBlank from "../../components/form/FormRowBlank"
  import SaveButton from "../../components/buttons/SaveButton"
  import Table from "../../components/Table"
  import CenterButton from "../../components/buttons/CenterButton"

  export default {
    name: "keywords",
    components: {
      CenterButton,
      Table,
      SaveButton,
      FormRowBlank,
      FormRowInput,
      CustomForm,
      Pagination,
      UpdateButton,
      Loader
    },
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
      selected() {
        return this.$store.state.detailItem.keywords[this.attributeId] || {}
      },
      selectedLength() {
        return Object.keys(this.selected).length
      },
      keywordsToSummarize() {
        let kts = ''
        let name
        for (let id in this.selected) {
          if (kts !== '') {
            kts += ', '
          }
          kts += "'" + this.selected[id].value + "'"
        }
        return kts
      },
      connectedAttributeVals() {
        let cav = ''
        let s
        for (let id in this.selected) {
          s = this.selected[id]
          for (let av in s.attributeValues) {
            if (cav !== '') {
              cav += ', '
            }
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
      updateKeywords() {
        var t = this
        this.$store.dispatch('getKeywordsFromDs', {entityId: this.entityId, attributeId: this.attributeId})
          .then(() => {
            t.loadKeywords(true)
          })
      }
    },
    watch: {
      attributeId(attributeId) {
        this.keywords = {}
        if (attributeId) {
          this.loadKeywords()
        }
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
  @import '../../assets/less/mixins';

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
