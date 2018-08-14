<template>
  <fr-blank :label="l.targetValues">
    <div v-if="onEdit">
      <b-row v-for="targetInd in targetIndex" class="targetValue">
        <b-col>
          <attribute-select v-model="targets[targetInd]"/>
        </b-col>
        <b-col md="1" v-if="targets.length > 1">
          <a @click="targets.splice(targetInd, 1)">×</a>
        </b-col>
      </b-row>
      <b-button @click="addTargets" v-if="newTargetPossible" size="sm" variant="outline-primary">{{l.addTarget}}
      </b-button>
    </div>
    <div v-else>
      <p v-for="t in targets">{{$tools.attributeFullName(t)}}</p>
    </div>
  </fr-blank>
</template>

<script>
  import AttributeSelect from "../../components/form/AttributeCompleteSelect"
  import FormRowBlank from "../../components/form/FormRowBlank"

  export default {
    name: "TargetValues",
    components: {FormRowBlank, AttributeSelect},
    props: {
      value: Array
    },
    computed: {
      l() {
        return this.$store.state.lang.intents
      },
      targets: {
        get() {
          return this.$store.state.detailItem.intents.targetValueIds
        },
        set(value) {
          this.$store.commit('updateDetailItem', {route: 'intents', key: 'targetValueIds', value})
        }
      },
      targetIndex() {
        let ti = []
        for (let i = 0; i < this.targets.length; i++) ti.push(i)
        return ti
      },
      newTargetPossible() {
        let t = this.targets
        return !(!t[t.length - 1])
      },
      onEdit() {
        return this.$store.state.onEdit.intents
      }
    },
    methods: {
      addTargets() {
        this.targets = this.targets.concat([null])
      }
    }
  }
</script>

<style scoped>
  .targetValue {
    margin-bottom: .5rem;
  }

  a {
    text-align: left;
    cursor: pointer;
  }

</style>
