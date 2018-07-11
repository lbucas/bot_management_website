<template>

</template>

<script>
  import Icon from "../../components/Icon"
  export default {
    name: "ConnectionEdit",
    components: {Icon},
    data() {
      return {
        editing: false
      }
    },
    computed: {
      joinDetails() {
        return this.$store.state.detailItem.joins
      }
    }
  }
</script>

<style scoped>

</style>
