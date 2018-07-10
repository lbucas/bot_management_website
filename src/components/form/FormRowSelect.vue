<template>
  <FormRowBlank :label="label">
    <input v-if="!onEdit || !editable" type="text" readonly class="form-control-plaintext" :value="cDisplayValue">
    <SuggestionSelect v-model="inputValue" v-if="onEdit && editable && suggestions" :change="change" :list="list"
                      :list-display-value="listDisplayValue"/>
    <select class="form-control" v-if="onEdit && editable && !suggestions" v-model="inputValue"
            :class="{'is-invalid': !valid}">
      <option v-for="(item, id) in list" :value="id">{{item[listDisplayValue]}}</option>
    </select>
    <div class="validationMessage" v-if="error">
      {{error}}
    </div>
  </FormRowBlank>
</template>

<script>
  import FormRowBlank from "./FormRowBlank"
  import SuggestionSelect from "./SuggestionSelect"
  import FormComponent from "../mixins/FormComponent"

  export default {
    name: "FormRowSelect",
    mixins: [FormComponent],
    components: {SuggestionSelect, FormRowBlank},
    props: {
      list: Object,
      displayValue: {
        type: String,
        default: '--SearchList--'
      },
      listDisplayValue: {
        type: String,
        default: 'name'
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
    computed: {
      cDisplayValue() {
        var dv = this.displayValue
        if (dv === '--SearchList--') {
          try {
            let v = this.$props.list[this.inputValue][this.$props.listDisplayValue]
            return v
          } catch (e) {
            return ''
          }
        } else {
          return dv
        }
      }
    }
  }
</script>

<style scoped>

</style>
