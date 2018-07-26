<script>
  export default {
    name: "expandable",
    data() {
      return {
        expanded: {}
      }
    },
    methods: {
      expand(id) {
        let e = this.expanded
        id in e ? this.$delete(e, id, true) : this.$set(e, id, true)
      }
    }
  }
</script>

