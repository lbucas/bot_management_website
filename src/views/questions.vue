<template>
  <MasterDetail route="intents" tableheading="Available Questions">
    <div>
      <b-tabs>
        <b-tab class="tabTitle" title="General" active>
          <CustomForm id="intentDetails">
            <form-row-input v-model="intentDetail.name" label="Title" :on-edit="onEdit"/>
            <form-row-select v-model="intentDetail.charttype" label="Charttype" :on-edit="onEdit" :list="charttypes"/>
            <form-row-select v-model="intentDetail.groupBy" label="Group by" :on-edit="onEdit" :list="entities" />
            <form-row-array-input v-model="intentDetail.filterByIds" :lookup-list="entitiesWithoutGroupedBy" label="Filterable by"
                                  :on-edit="onEdit" :placeholder="'Add Entities to filter by'"/>
          </CustomForm>
        </b-tab>
      </b-tabs>

    </div>
  </MasterDetail>

</template>

<script>
  import MasterDetail from '../components/MasterDetail.vue'
  import FormRowInput from "../components/form/FormRowInput"
  import FormRowSelect from "../components/form/FormRowSelect"
  import SuggestionSelect from "../components/form/SuggestionSelect"
  import FormRowArrayInput from "../components/form/FormRowArrayInput"
  import CustomForm from "../components/form/CustomForm"

  export default {
    components: {
      CustomForm,
      FormRowArrayInput,
      SuggestionSelect,
      FormRowSelect,
      FormRowInput,
      MasterDetail
    },
    name: "intents",
    data() {
      return {}
    },
    computed: {
      intents() {
        return this.$store.state.intents
      },
      aggregations() {
        return this.$store.state.aggregations
      },
      entities() {
        return this.$store.state.entities
      },
      datasources() {
        return this.$store.state.datasources
      },
      charttypes() {
        return this.$store.state.charttypes
      },
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
          if (eid !== this.intentDetail.groupBy) {
            e[eid] = this.entities[eid]
          }
        }
        return e
      },
      groupById() {
        return this.intentDetail.groupBy
      }
    },
    created() {
      this.getIntents()
      this.getIntentOptions()
    },
    methods: {
      getIntents(showAfterLoading) {
        return true
      },
      getIntentOptions() {
        this.$store.dispatch('load', ['aggregations', 'entities', 'datasources', 'charttypes'])
      }
    },
    watch: {
      groupById(id) {
        this.$tools.deleteFromArray(this.intentDetail.filterByIds, id)
      }
    }
  }
</script>


<style lang="less" scoped>
  #intentDetails {
    margin-top: 1em;
  }

</style>
