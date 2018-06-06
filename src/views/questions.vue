<template>
  <MasterDetail :addnew="addIntent" tableheading="Questions" :selected="chooseIntent" :tablecontent="intents"
                :loading="loading" :manualchoose="manualIntentChoose" :update="getIntents">
    <div>
      <b-tabs>
        <b-tab class="tabTitle" title="General" active>
          <CustomForm id="intentDetails">
            <form-row-input v-model="intentDetail.name" label="Title" :on-edit="onEdit"/>
            <form-row-select v-model="intentDetail.charttype" label="Charttype" :on-edit="onEdit" :list="charttypes"/>
            <form-row-array-input v-model="intentDetail.filterByIds" :lookup-list="entities" label="Groupable by"
                                 :on-edit="onEdit" :placeholder="'Add Entities to group by'"/>
            <form-row-array-input v-model="intentDetail.filterByIds" :lookup-list="entities" label="Filterable by"
                                  :on-edit="onEdit" :placeholder="'Add Entities to filter by'"/>
          </CustomForm>
        </b-tab>
      </b-tabs>

    </div>
  </MasterDetail>

</template>

<script>
  import MasterDetail from '../components/MasterDetail.vue'
  import FormRowInput from "../components/FormRowInput"
  import FormRowSelect from "../components/FormRowSelect"
  import SuggestionSelect from "../components/SuggestionSelect"
  import FormRowArrayInput from "../components/FormRowArrayInput"
  import CustomForm from "../components/CustomForm"

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
      return {
        intents: {},
        aggregations: {},
        entities: {},
        datasources: {},
        charttypes: {},
        intentDetail: {
          name: "",
          charttype: "",
          calculationNeeded: true,
          id: "string",
          targetValueIds: [
            ''
          ],
          filterByIds: [
            ''
          ],
          projectId: "string",
          aggregationId: "string"
        },
        manualIntentChoose: '',
        loading: true,
        onEdit: false
      }
    },
    computed: {
      currentChartType() {
        let ctname
        try {
          ctname = this.charttypes[this.intentDetail.charttype].name
        } catch (e) {
          ctname = ''
        }
        return ctname
      }
    },
    created() {
      this.getIntents()
      this.getIntentOptions()
    },
    methods: {
      getIntents(showAfterLoading) {
        var t = this
        this.$root.getAndSet(
          'intents',
          t.intents,
          null,
          function (d) {
            t.loading = false
            if (showAfterLoading) {
              t.manualIntentChoose = showAfterLoading
            }
          }
        )
      },
      getIntentOptions() {
        var t = this
        t.$root.getAndSet('aggregations', t.aggregations)
        t.$root.getAndSet('entities', t.entities)
        t.$root.getAndSet('datasources', t.datasources, null, null, {filter: {include: {tables: "attributes"}}})
        t.$root.getAndSet('charttypes', t.charttypes)
      },
      addIntent() {
        let newIntent = {
          name: "",
          charttype: "",
          calculationNeeded: true,
          id: "string",
          targetValueIds: [],
          groupByIds: [],
          filterByIds: [],
          projectId: "string",
          aggregationId: "string"
        }
        this.$root.clone(this.intentDetail, newIntent)
        this.onEdit = true
      },
      chooseIntent(i) {
      }
    }
  }
</script>


<style lang="less" scoped>
  #intentDetails {
    margin-top: 1em;
  }

</style>
