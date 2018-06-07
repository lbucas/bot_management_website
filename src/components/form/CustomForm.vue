<template>
  <table class="table formTable">
    <tbody>
    <slot></slot>
    </tbody>
  </table>
</template>

<script>
  export default {
    name: "CustomForm"
  }
</script>

<style lang="less" scoped>
  @import "../../assets/less/colors";
  /* first child no top border */
  .formTable {
    tbody {
      border-top: 2px solid @background;
    }
  }

</style>
