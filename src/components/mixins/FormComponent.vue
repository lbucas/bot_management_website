<script>
  export default {
    name: "FormComponent",
    props: {
      label: String
    },
    computed: {
      onEdit() {
        let oe = this.$parent.onEdit
        if (oe === undefined) {
          oe = true
        }
        return oe
      }
    }
  }
</script>
