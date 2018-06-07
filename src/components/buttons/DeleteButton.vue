<template>
  <b-button-group class="deleteButtonGroup">
    <b-button variant="outline-danger" @click="onDelete" v-if="confirmDialog">
      Confirm
    </b-button>
    <b-button variant="danger" @click="confirmDialog = !confirmDialog">
      {{deleteText}}
    </b-button>
  </b-button-group>
</template>

<script>
  export default {
    name: "DeleteButton",
    props: {
      onDelete: Function,
      addDeleteText: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        confirmDialog: false
      }
    },
    computed: {
      deleteText() {
        return (this.confirmDialog ? "Cancel" : "Delete" + this.addDeleteText)
      }
    }
  }
</script>

<style scoped>
  .deleteButtonGroup {
    float: right;
  }

</style>
