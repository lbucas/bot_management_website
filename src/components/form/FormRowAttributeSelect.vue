<template>
  <fr-blank :label="label">
    <input v-if="!onEdit" type="text" readonly class="form-control-plaintext"
           v-model="currentAttributeFullName">
    <attribute-select v-else v-model="inputValue" :valid="valid" :datatype="datatype"/>
    <div class="validationMessage" v-if="error">
      {{error}}
    </div>
  </fr-blank>
</template>

<script>
  import FormComponent from "../mixins/FormComponent"
  import AttributeSelect from "./AttributeCompleteSelect"

  export default {
    name: "FormRowAttributeSelect",
    mixins: [FormComponent],
    components: {AttributeSelect},
    props: {
      datatype: {
        type: String,
        default: null
      }
    },
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
        return this.$tools.attributeFullName(this.inputValue)
      }
    }
  }
</script>

<style scoped>
  select {
    margin-bottom: .5em;
  }
</style>
