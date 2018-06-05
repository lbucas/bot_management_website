<template>
  <div class="form-group row">
    <label class="col-sm-2 col-form-label">{{label}}</label>
    <div class="col-sm-10">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "FormRowBlank",
    props: {
      label: String
    }
  }
</script>

<style scoped>
  .col-form-label {
    font-style: italic;
  }

</style>
