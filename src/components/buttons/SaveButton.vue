<template>
  <b-button variant="primary" @click="onSave" :disabled="disabled">Save
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
      }
    }
  }
</script>

<style scoped>

</style>
