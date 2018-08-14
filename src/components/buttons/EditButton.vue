<template>
  <b-button variant="primary" @click="$store.commit('editing', route)" v-if="!onEdit">{{$root.l.edit}}</b-button>
</template>

<script>
  export default {
    name: "EditButton",
    props: {
      route: String
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
