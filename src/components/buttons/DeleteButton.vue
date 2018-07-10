<template>
  <b-button-group class="deleteButtonGroup">
    <b-button variant="outline-danger" :size="size" @click="deleteWrapper" v-if="confirmDialog">
      Confirm
    </b-button>
    <b-button variant="danger" :size="size" @click="confirmDialog = !confirmDialog">
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
      },
      size: {
        type: String,
        default: 'md'
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
    },
    methods: {
      deleteWrapper() {
        this.onDelete()
        this.confirmDialog = false
      }
    }
  }
</script>

<style scoped>
  .deleteButtonGroup {
    float: right;
  }

  .btn {
    margin-bottom: 0 !important;
  }

</style>
