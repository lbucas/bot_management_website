<template>
  <fr-blank :label="label" v-if="!onEdit">
    <input type="text" readonly class="form-control-plaintext" v-model="displayValue"/>
  </fr-blank>
</template>

<script>
  import FormComponent from "../mixins/FormComponent"

  const filters = {
    date(v) {
      return new Date(v)
    }
  }
  export default {
    name: "FormRowDisplay",
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
