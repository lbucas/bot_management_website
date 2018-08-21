<template>
  <b-button variant="primary" @click="saveWrapper" :disabled="disabled">
    {{textOnButton}}
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
        default: null
      },
      route: {
        type: String,
        default: null
      }
    },
    computed: {
      textOnButton() {
        return this.text || this.$root.l.save
      }
    },
    methods: {
      saveWrapper() {
        if (this.route) {
          if (this.$store.getters.savable[this.route]) {
            this.onSave()
            this.$store.commit('hideValidations', this.route)
          } else this.$store.commit('setValidationsVisible', this.route)
        } else this.onSave()
      }
    }
  }
</script>

<style scoped>

</style>
