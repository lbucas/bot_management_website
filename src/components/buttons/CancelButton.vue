<template>
  <b-button variant="secondary" v-if="onEdit"
            @click="$store.dispatch('setBackEditing', route)">
    {{text}}
  </b-button>
</template>

<script>
  export default {
    name: "CancelButton",
    props: {
      route: String,
      text: {
        type: String,
        default: "Cancel"
      }
    },
    computed: {
      onEdit() {
        return this.$store.state.onEdit[this.route]
      }
    }
  }
</script>

<style scoped>

</style>
