<template>
  <b-button variant="primary" @click="onSave" :disabled="disabled">
    {{text}}
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
        default: 'Save'
      }
    }
  }
</script>

<style scoped>

</style>
