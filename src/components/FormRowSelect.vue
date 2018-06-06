<template>
  <FormRowBlank :label="label">
    <input v-if="!onEdit || !editable" type="text" readonly class="form-control-plaintext" :value="cDisplayValue">
    <SuggestionSelect v-model="inputValue" v-if="onEdit && editable && suggestions" :change="change" :list="list" :list-display-value="listDisplayValue"/>
    <select class="form-control" v-if="onEdit && editable && !suggestions" v-model="inputValue">
      <option v-for="(item, id) in list" :value="id">{{item[listDisplayValue]}}</option>
    </select>
  </FormRowBlank>
</template>

<script>
  import FormRowBlank from "./FormRowBlank"
  import SuggestionSelect from "./SuggestionSelect"

  export default {
    name: "FormRowSelect",
    components: {SuggestionSelect, FormRowBlank},
    props: {
      label: String,
      value: String,
      list: Object,
      displayValue: {
        type: String,
        default: '--SearchList--'
      },
      listDisplayValue: {
        type: String,
        default: 'name'
      },
      onEdit: {
        type: Boolean,
        default: true
      },
      change: {
        type: Function,
        default: function () {
        }
      },
      editable: {
        type: Boolean,
        default: true
      },
      suggestions: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        inputValue: this.$props.value
      }
    },
    computed: {
      cDisplayValue() {
        var dv = this.displayValue
        if (dv === '--SearchList--') {
          try {
            let v = this.$props.list[this.$props.value][this.$props.listDisplayValue]
            return v
          } catch (e) {
            return ''
          }
        } else {
          return dv
        }
      }
    },
    watch: {
      inputValue(v) {
        this.$emit("input", v)
        this.change()
      },
      value(v) {
        this.inputValue = v
      }
    }
  }
</script>

<style scoped>

</style>
