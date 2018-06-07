<template>
  <div>
    {{testVal}}
    <ul>
      <li v-for="p in projects">{{p.name}}</li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "test",
    props: {},
    data() {
      return {}
    },
    computed: {
      testVal() {
        return this.$store.getters.testPlus1
      },
      projects() {
        return this.$store.state.projects
      }
    },
    created() {
      this.$store.dispatch('changeTest', 5)
      this.$store.dispatch('load', ['projects'])
      let at = this.$cookies.get('access_token')
      let expires = this.$cookies.get('access_token_validUntil')
    },
    methods: {},
    watch: {}
  }
</script>

<style scoped>

</style>
