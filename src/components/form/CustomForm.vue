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
      errorsVisible: {
        type: Boolean,
        default: false
      },
      route: String
    },
    computed: {
      errors() {
        if (this.errorsVisible) {
          return this.$store.getters.validationErrors[this.route] || {}
        } else {
          return false
        }
      },
      onEdit() {
        return this.$store.state.onEdit[this.route]
      }
    }
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
