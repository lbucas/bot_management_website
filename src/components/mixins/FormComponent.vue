<template></template>
<script>
  export default {
    name: "FormComponent",
    props: {
      label: String,
      modelKey: String,
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      inputValue: {
        get() {
          return this.target
        },
        set(value) {
          if (value !== this.target && value !== undefined) {
            this.$store.commit('updateDetailItem', {
              route: this.route,
              key: this.modelKey,
              value
            })
          }
        }
      },
      onEdit() {
        let oe = this.$parent.onEdit
        if (oe === undefined) {
          oe = true
        }
        return oe
      },
      validation() {
        if (this.$store.state.validationsVisible[this.route]) {
          let errs = this.$parent.errors
          for (let target in errs) {
            if (target === this.modelKey) {
              return errs[target]
            }
          }
        }
        return false
      },
      valid() {
        return !(this.validation)
      },
      route() {
        return this.$parent.$props.route
      },
      target() {
        return this.$tools.deepValue(this.$store.state.detailItem[this.route], this.modelKey)
      }
    }
  }
</script>

<style lang="less">
  @import "../../style/mixins";
  .validationMessage {
    #validationMessage
  }
</style>
