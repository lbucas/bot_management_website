<template>
  <fr-blank :label="l.customCalc">
    <b-button v-if="calc === null && onEdit" variant="outline-primary" size="sm" @click="addCalculation">
      {{l.addCalc}}
    </b-button>
    <div v-else>
      <p v-if="onEdit">{{l.validSqlHint}}</p>
      <b-form-textarea v-model="calc" :plaintext="!onEdit" :rows="3" id="customCalc"/>
      <div v-if="onEdit">
        <b-button variant="outline-secondary" size="sm" @click="addCalculation">{{$root.l.reset}}</b-button>
        <b-button variant="outline-secondary" size="sm" @click="calc = null">{{$root.l.cancel}}</b-button>
      </div>
    </div>
  </fr-blank>
</template>

<script>
  import FormRowBlank from "../../components/form/FormRowBlank"
  import CenterButton from "../../components/buttons/CenterButton"

  export default {
    name: "CustomCalculation",
    components: {CenterButton, FormRowBlank},
    computed: {
      l() {
        return this.$store.state.lang.intents
      },
      calc: {
        get() {
          return this.$store.state.detailItem.intents.calculationNeeded
        },
        set(value) {
          this.$store.commit('updateDetailItem', {route: 'intents', key: 'calculationNeeded', value})
        }
      },
      targetValueIds() {
        return this.$store.state.detailItem.intents.targetValueIds
      },
      targetValues() {
        let st = this.$store
        let attrs = st.getters.attributes
        let tables = st.getters.tables
        let targets = ''
        for (let tvid of this.targetValueIds) {
          try {
            let attr = attrs[tvid]
            let table = tables[attr.tableId]
            targets += `"${table.name}"."${attr.name}" `
          } catch (e) {
          }
        }
        targets = targets.trim()
        let aggr = st.state.detailItem.intents.aggregationId
        if (aggr && this.targetValueIds.length === 1) {
          let operation = st.state.aggregations[aggr].operation
          if (operation !== 'NONE') {
            targets = `${operation}(${targets})`
          }
        }
        return targets
      },
      onEdit() {
        return this.$store.state.onEdit.intents
      }
    },
    methods: {
      addCalculation() {
        this.calc = this.targetValues
      }
    },
    watch: {
      targetValueIds: {
        deep: true,
        handler() {
          if (this.calc !== null) {
            this.addCalculation()
          }
        }
      }
    }
  }
</script>

<style scoped>
  #customCalc {
    margin-bottom: .5rem;
    font-size: .8rem;
  }
</style>
