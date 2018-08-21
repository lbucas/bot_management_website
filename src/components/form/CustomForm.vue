<template>
  <table class="table formTable">
    <tbody>
    <slot></slot>
    </tbody>
  </table>
</template>

<script>
  export default {
    name: "CustomForm",
    props: {
      inline: {
        type: Boolean,
        default: true
      },
      route: {
        type: String,
        default: null
      }
    },
    computed: {
      errors() {
        return this.$store.getters.validationErrors[this.route] || {}
      },
      onEdit() {
        return this.$store.state.onEdit[this.route]
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../style/colors";
  /* first child no top border */
  .formTable {
    tbody {
      border-top: 2px solid @background;
    }
  }

</style>
