<template>
  <b-button variant="primary" @click="onSave" :disabled="disabled">
    {{textOnButton}}
  </b-button>
</template>

<script>
  export default {
    name: "SaveButton",
    props: {
      onSave: Function,
      disabled: {
        type: Boolean,
        default: false
      },
      text: {
        type: String,
        default: null
      }
    },
    computed: {
      textOnButton() {
        return this.text || this.$root.l.save
      }
    }
  }
</script>

<style scoped>

</style>
