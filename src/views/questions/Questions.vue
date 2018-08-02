<template>
  <master-detail route="intents" tableheading="Available Questions">
    <div>
      <b-tabs>
        <b-tab class="tabTitle" title="General" active>
          <custom-form id="intentDetails" route="intents">
            <fr-input model-key="name" :editable="!intentDetail.id" label="Title"/>
            <target-values/>
            <transition name="view" mode="out-in">
              <fr-select v-if="intentDetail.calculationNeeded === null"
                         model-key="aggregationId" label="Aggregation" :disabled="targetValueLength > 1"
                         list-display-value="operation" :list="aggregations"/>
            </transition>
            <custom-calculation/>
            <fr-select model-key="charttypeId" label="Charttype" :list="charttypes" list-display-value="displayName"
                       :disabled="targetValueLength > 1 && !intentDetail.calculationNeeded"/>
            <transition name="view" mode="out-in">
              <fr-attribute-select v-if="groupByVisible" model-key="groupById" label="Group By"
                                   :datatype="groupByDatatype"/>
            </transition>
            <fr-array-input model-key="filterByIds" :lookup-list="entitiesWithoutGroupedBy"
                            label="Filterable by" :placeholder="'Add Entities to filter by'"/>
            <fixed-filters/>
          </custom-form>
          <save :on-save="saveIntent" v-if="onEdit" :disabled="!savable"/>
          <cancel route="intents"/>
          <edit route="intents"/>
          <delete v-if="!onEdit" :on-delete="deleteIntent"/>
        </b-tab>
        <b-tab v-if="!onEdit" class="tabTitle" title="Training sentences">
          <training :intentId="intentDetail.id"/>
        </b-tab>
      </b-tabs>

    </div>
  </master-detail>

</template>

<script>
  import StoreItems from '../../components/mixins/StoreItems'
  import Training from "./Training"
  import TargetValues from "./TargetValues"
  import CustomCalculation from "./CustomCalculation"
  import FixedFilters from "./FixedFilters"

  export default {
    components: {FixedFilters, CustomCalculation, TargetValues, Training},
    mixins: [StoreItems],
    name: "intents",
    computed: {
      onEdit() {
        return this.$store.state.onEdit.intents
      },
      loading() {
        return this.$store.state.loaders.intents
      },
      intentDetail() {
        return this.$store.state.detailItem.intents
      },
      entitiesWithoutGroupedBy() {
        let e = {}
        for (let eid in this.entities) {
          if (eid !== this.intentDetail.groupById) {
            e[eid] = this.entities[eid]
          }
        }
        return e
      },
      savable() {
        return this.$store.getters.savable.intents
      },
      groupByDatatype() {
        try {
          return this.charttypes[this.intentDetail.charttypeId].name === 'Graph' ? 'datetime' : null
        } catch (e) {
          return null
        }
      },
      groupByVisible() {
        return this.intentDetail.targetValueIds.length === 1 || this.intentDetail.calculationNeeded
      },
      targetValues() {
        return this.intentDetail.targetValueIds
      },
      targetValueLength() {
        return this.targetValues.length
      },
      noAggregationId() {
        for (let agId in this.aggregations) {
          if (this.aggregations[agId].operation === 'NONE') {
            return agId
          }
        }
      },
      charttypeTableId() {
        for (let tId in this.charttypes) {
          if (this.charttypes[tId].name === 'Table') {
            return tId
          }
        }
      }
    },
    created() {
      this.getIntents()
      this.getIntentOptions()
    },
    methods: {
      getIntents() {
        this.$store.dispatch('load', 'intents')
      },
      getIntentOptions() {
        this.$store.dispatch('load', ['datasources', 'aggregations', 'entities', 'charttypes'])
      },
      saveIntent() {
        let intDet = {}
        this.$tools.clone(intDet, this.intentDetail)
        if (Array.isArray(intDet.fixedFilter)) {
          let v = {}
          for (let f of intDet.fixedFilter) v[f.attributeId] = f.filters
          intDet.fixedFilter = v
        }
        intDet.groupById = [intDet.groupById]
        intDet.projectId = this.$store.projectId
        intDet.id
          ? this.$store.dispatch('patch', {route: 'intents', toPatch: intDet})
          : this.$store.dispatch('create', {route: 'intents', toCreate: intDet})
      },
      deleteIntent() {
        this.$store.dispatch('delete', {route: 'intents', toDelete: this.intentDetail.id})
      }
    },
    watch: {
      targetValueLength(len, oldLen) {
        if (len === 2 && oldLen === 1) { // Agrregation NONE is assigned
          this.$store.commit('updateDetailItem', {
            route: 'intents',
            key: 'aggregationId',
            value: this.noAggregationId
          })
          this.$store.commit('updateDetailItem', {
            route: 'intents',
            key: 'charttypeId',
            value: this.charttypeTableId
          })
        }
      }
    }
  }
</script>


<style lang="less" scoped>
  #intentDetails {
    margin-top: 1em;
  }

</style>
