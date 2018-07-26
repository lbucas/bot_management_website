<template>
  <form-row-blank :label="label">
    <input v-if="!onEdit" type="text" readonly class="form-control-plaintext"
           v-model="currentAttributeFullName">
    <attribute-select v-else v-model="inputValue" :valid="valid"/>
    <div class="validationMessage" v-if="error">
      {{error}}
    </div>
  </form-row-blank>
</template>

<script>
  import FormRowBlank from "./FormRowBlank"
  import FormComponent from "../mixins/FormComponent"
  import AttributeSelect from "./AttributeCompleteSelect"

  export default {
    name: "FormRowAttributeSelect",
    mixins: [FormComponent],
    components: {AttributeSelect, FormRowBlank},
    computed: {
      datasources() {
        return this.$store.state.datasources
      },
      tables() {
        return this.$store.getters.tables
      },
      attributes() {
        return this.$store.getters.attributes
      },
      currentAttributeFullName() {
        try {
          let attr = this.attributes[this.inputValue]
          return this.datasources[attr.datasourceId].name + ' - ' + this.tables[attr.tableId].name + ' - ' +
            attr.name
        } catch (e) {
          return ''
        }
      }
    }
  }
</script>

<style scoped>
  select {
    margin-bottom: .5em;
  }
</style>
