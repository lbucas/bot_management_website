<template>
  <MasterDetail route="intents" tableheading="Available Questions">
    <div>
      <b-tabs>
        <b-tab class="tabTitle" title="General" active>
          <custom-form id="intentDetails" :on-edit="onEdit">
            <form-row-input v-model="intentDetail.name" label="Title"/>
            <form-row-attribute-select v-model="intentDetail.targetValueId" label="Target Value"/>
            <form-row-select v-model="intentDetail.aggregationId" label="Aggregation" list-display-value="operation"
                             :list="aggregations"/>
            <form-row-select v-model="intentDetail.charttypeId" label="Charttype" :list="charttypes"/>
            <form-row-select v-model="intentDetail.groupById" label="Group by" :list="entities"/>
            <form-row-array-input v-model="intentDetail.filterByIds" :lookup-list="entitiesWithoutGroupedBy"
                                  label="Filterable by"
                                  :placeholder="'Add Entities to filter by'"/>
          </custom-form>
          <save-button :on-save="saveIntent" v-if="onEdit"/>
          <cancel-button route="intents"/>
          <edit-button route="intents"/>
          <delete-button v-if="!onEdit" :on-delete="deleteIntent"/>
        </b-tab>
        <b-tab class="tabTitle" title="Training sentences">
          <training :intentId="intentDetail.id"/>
        </b-tab>
      </b-tabs>

    </div>
  </MasterDetail>

</template>

<script>
  import MasterDetail from '../../components/MasterDetail.vue'
  import FormRowInput from "../../components/form/FormRowInput"
  import FormRowSelect from "../../components/form/FormRowSelect"
  import SuggestionSelect from "../../components/form/SuggestionSelect"
  import FormRowArrayInput from "../../components/form/FormRowArrayInput"
  import CustomForm from "../../components/form/CustomForm"
  import FormRowAttributeSelect from "../../components/form/FormRowAttributeSelect"
  import StoreItems from '../../components/mixins/StoreItems'
  import SaveButton from "../../components/buttons/SaveButton"
  import CancelButton from "../../components/buttons/CancelButton"
  import EditButton from "../../components/buttons/EditButton"
  import DeleteButton from "../../components/buttons/DeleteButton"
  import Training from "./Training"

  export default {
    components: {
      Training,
      DeleteButton,
      EditButton,
      CancelButton,
      SaveButton,
      FormRowAttributeSelect,
      CustomForm,
      FormRowArrayInput,
      SuggestionSelect,
      FormRowSelect,
      FormRowInput,
      MasterDetail
    },
    mixins: [StoreItems],
    name: "intents",
    data() {
      return {}
    },
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
      groupById() {
        return this.intentDetail.groupById
      }
    },
    created() {
      this.getIntents()
      this.getIntentOptions()
    },
    methods: {
      getIntents(showAfterLoading) {
        this.$store.dispatch('load', 'intents')
      },
      getIntentOptions() {
        this.$store.dispatch('load', ['datasources', 'aggregations', 'entities', 'charttypes'])
      },
      saveIntent() {
        let intDet = {}
        this.$root.clone(intDet, this.intentDetail)
        intDet.groupById = [intDet.groupById]
        intDet.targetValueId = [intDet.targetValueId]
        intDet.projectId = this.$store.projectId
        if (intDet.id) {
          this.$store.dispatch('patch', {route: 'intents', toPatch: intDet})
        } else {
          this.$store.dispatch('create', {route: 'intents', toCreate: intDet})
        }
      },
      deleteIntent() {
        this.$store.dispatch('delete', {route: 'intents', toDelete: this.intentDetail.id})
      }
    },
    watch: {
      groupById(id) {
        this.intentDetail.filterByIds = this.$tools.removeFromArray(this.intentDetail.filterByIds, id)
      }
    }
  }
</script>


<style lang="less" scoped>
  #intentDetails {
    margin-top: 1em;
  }

</style>
