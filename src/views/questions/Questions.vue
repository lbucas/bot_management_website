<template>
  <master-detail route="intents" tableheading="Available Questions">
    <div>
      <b-tabs>
        <b-tab class="tabTitle" title="General" active>
          <custom-form id="intentDetails" route="intents">
            <fr-input model-key="name" :editable="!intentDetail.id" label="Title"/>
            <target-values/>
            <fr-select v-if="intentDetail.calculationNeeded === null"
                       model-key="aggregationId" label="Aggregation" :disabled="targetValues.length > 1"
                       list-display-value="operation" :list="aggregations"/>
            <custom-calculation/>
            <fr-select v-if="chartUsable" model-key="charttypeId" label="Charttype" :list="charttypes"
                       list-display-value="displayName"/>
            <fr-attribute-select v-if="chartUsable" model-key="groupById" label="Group By" :datatype="groupByDatatype"/>
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
      chartUsable() {
        return (this.intentDetail.targetValueIds.length === 1 &&
          this.intentDetail.aggregationId !== null &&
          this.aggregations[this.intentDetail.aggregationId].operation !== 'NONE') ||
          this.intentDetail.calculationNeeded
      },
      targetValues() {
        return this.intentDetail.targetValueIds
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
      targetValues: {
        deep: true,
        handler(t) {
          if (t.length > 1) {
            for (let agId in this.aggregations) {
              if (this.aggregations[agId].operation === 'NONE') {
                this.$store.commit('updateDetailItem', {route: 'intents', key: 'aggregationId', value: agId})
                break
              }
            }
          }
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
