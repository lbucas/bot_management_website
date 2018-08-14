<template>
  <b-button variant="secondary" v-if="onEdit"
            @click="cancelWrapper ">
    {{text}}
  </b-button>
</template>

<script>
  export default {
    name: "CancelButton",
    props: {
      route: String,
      onCancel: {
        type: Function,
        default() {}
      }
    },
    computed: {
      newItem() {
        return !this.$store.state.detailItem[this.route].id
      },
      onEdit() {
        return this.$store.state.onEdit[this.route]
      },
      text() {
        return (this.newItem ? this.$root.l.clear : this.$root.l.cancel)
      }
    },
    methods: {
      cancelWrapper() {
        if (this.newItem) {
          this.$store.dispatch('newDetailItem', this.route)
        } else {
          this.$store.dispatch('setBackEditing', this.route)
        }
        this.onCancel()
      }
    }
  }
</script>

<style scoped>

</style>
