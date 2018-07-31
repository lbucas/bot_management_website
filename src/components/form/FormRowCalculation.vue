<template>
  <fr-blank :label="label">
    <input type="text" :readonly="!onEdit"
           :class="{ 'form-control-plaintext': !onEdit , 'form-control': onEdit, 'is-invalid': !valid}"
           v-model="inputValue"/>
    <div class="invalid-feedback">
      {{error}}
    </div>
    <attribute-select v-model="attributeToAdd"/>
    <b-button v-if="attributeToAddName" variant="primary" @click="addAttribute">+</b-button>
  </fr-blank>
</template>

<script>
  import FormRowBlank from "./FormRowBlank"
  import FormComponent from "../mixins/FormComponent"
  import AttributeSelect from "./AttributeCompleteSelect"

  export default {
    name: "FormRowCalculation",
    components: {AttributeSelect, FormRowBlank},
    mixins: [FormComponent],
    props: {
      targetValueAdded: Function
    },
    data() {
      return {
        attributeToAdd: null
      }
    },
    computed: {
      attributeToAddName() {
        try {
          let attr = this.$store.getters.attributes[this.attributeToAdd]
          return `"${this.$store.getters.tables[attr.tableId].name}"."${attr.name}"`
        } catch (e) {
          return null
        }
      }
    },
    methods: {
      addAttribute() {
        this.inputValue += this.attributeToAddName
        this.targetValueAdded(this.attributeToAdd)
        this.attributeToAdd = null
      }
    }

  }
</script>

<style scoped>

</style>
