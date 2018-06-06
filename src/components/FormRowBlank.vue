<template>
  <tr>
    <td>
      <div class="form-group row customFormRow">
        <label class="col-sm-2 col-form-label">{{label}}</label>
        <div class="col-sm-10">
          <slot></slot>
        </div>
      </div>
    </td>
  </tr>

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
  .customFormRow {
    margin-bottom: 0;
  }

</style>
