<template>
  <fr-blank :label="label">
    <input readonly v-if="!onEdit" class="form-control-plaintext" v-model="plainTextArray"/>
    <div v-if="onEdit">
      <div class="arrayInputDisplay">
        <h5>
          <b-badge v-for="i in inputList">
            {{lookup(i)}}
            <span class="removeFromList" @click="removeFromList(i)">×</span>
          </b-badge>
        </h5>
      </div>
      <suggestion-select v-model="addNext" :list="remainingOptions" :placeholder="placeholder" clear-after-select/>
    </div>
  </fr-blank>
</template>

<script>
  import SuggestionSelect from "./SuggestionSelect"
  import FormComponent from "../mixins/FormComponent"

  export default {
    name: "FormRowArrayInput",
    mixins: [FormComponent],
    components: {SuggestionSelect},
    props: {
      value: Array,
      lookupList: Object,
      displayValue: {
        type: String,
        default: 'name'
      },
      placeholder: {
        type: String,
        default: 'Add new items'
      }
    },
    data() {
      return {
        inputList: {},
        addNext: ''
      }
    },
    computed: {
      remainingOptions() {
        // Filter only the options that are not already selected
        let remaining = {}
        let lookupL = this.lookupList
        let inputL = this.inputList
        let v
        for (let lkey in lookupL) {
          v = inputL[lkey]
          if (!v) {
            remaining[lkey] = lookupL[lkey]
          }
        }
        return remaining
      },
      plainTextArray() {
        let list = this.inputList
        let plain = ''
        for (let ikey in list) {
          plain += this.lookup(ikey) + ', '
        }
        plain = plain.substring(0, plain.length - 2) // to take away the unnecessary ', '
        return plain
      }
    },
    created() {
      let toSet = this.arrayToObject(this.inputValue)
      for (let oldKey in this.inputList) {
        if (!(oldKey in toSet)) {
          this.$delete(this.inputList, oldKey)
        }
      }
      for (let newKey in toSet) {
        this.$set(this.inputList, newKey, toSet[newKey])
      }
    },
    methods: {
      lookup(i) {
        let val
        try {
          val = this.lookupList[i][this.displayValue]
        } catch (e) {
          val = i
        }
        return val
      },
      removeFromList(i) {
        this.$delete(this.inputList, i)
      },
      arrayToObject(toTransform) {
        return toTransform.reduce(function (acc, cur, i) {
          acc[cur] = cur
          return acc
        }, {})
      }
    },
    watch: {
      inputList(v) {
        let il = this.$tools.objectToArray(v)
        this.inputValue = il
      },
      addNext(v) {
        this.$set(this.inputList, v, v)
        let toEmit = []
        for (let id in this.inputList) {
          toEmit.push(id)
        }
        this.$emit("input", toEmit)
      },
      lookupList(list) {
        for (let key in this.inputList) {
          if (!(key in list)) {
            this.$delete(this.inputList, key)
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../style/mixins";
  @import "../../style/colors";

  .arrayInputDisplay {
    width: 100%;
    background: white;
    //#bootrapInput;
    .badge {
      #noUserSelect;
      margin: .25rem .25rem .25rem .25rem;
      background: white;
      color: @richPurple;
      border: 1px solid @richPurple;
      .removeFromList {
        cursor: pointer;
      }
    }
  }

</style>
