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
    data() {
      return {
        inputValue: null
      }
    },
    computed: {
      onEdit() {
        let oe = this.$parent.onEdit
        if (oe === undefined) {
          oe = true
        }
        return oe
      },
      error() {
        let errs = this.$parent.errors
        for (let target in errs) {
          if (target === this.modelKey) {
            return errs[target]
          }
        }
        return null
      },
      valid() {
        return !(this.error)
      },
      route() {
        return this.$parent.$props.route
      },
      target() {
        return this.$tools.deepValue(this.$store.state.detailItem[this.route], this.modelKey)
      }
    },
    created() {
      this.inputValue = this.$tools.deepValue(this.$store.state.detailItem[this.route], this.modelKey)
    },
    watch: {
      target(value) {
        this.inputValue = value
      },
      inputValue(value, old) {
        if (value !== old && value) {
          this.$store.commit('updateDetailItem', {
            route: this.route,
            key: this.modelKey,
            value
          })
        }
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
