<template>
  <tr>
    <td class="formTableTd">
      <div class="form-group row customFormRow">
        <label :class="{'col-lg-2': inline, 'col-12': !inline, 'col-form-label': true}">
          {{label}}:
        </label>
        <div :class="{'col-lg-10': inline, 'col-12': !inline}">
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
    },
    computed: {
      inline() {
        let inline = this.$parent.inline
        if (inline === undefined) {
          inline = this.$parent.$parent.inline
          if (inline === undefined) {
            inline = true
          }
        }
        return inline
      }
    }
  }
</script>

<style lang="less" scoped>
  .customFormRow {
    margin-bottom: 0;
  }
  label{
    font-size: 1rem !important;
  }

</style>
