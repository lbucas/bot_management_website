<template>
  <form-row-blank :label="label" v-if="!onEdit">
    <input type="text" readonly class="form-control-plaintext" v-model="displayValue"/>
  </form-row-blank>
</template>

<script>
  import FormRowBlank from "./FormRowBlank"
  import FormComponent from "../mixins/FormComponent"

  const filters = {
    date(v) {
      return new Date(v)
    }
  }
  export default {
    name: "FormRowDisplay",
    components: {FormRowBlank},
    mixins: [FormComponent],
    props: {
      modelKey: String,
      filter: {
        type: String,
        default: ''
      }
    },
    computed: {
      displayValue() {
        if (this.filter) {
          let filter = filters[this.filter]
          return filter ? filter(this.inputValue) : this.inputValue
        } else {
          return this.inputValue
        }
      }
    }
  }
</script>

<style scoped>

</style>
