<template>
  <b-button-group class="deleteButtonGroup">
    <transition name="view" mode="out-in">
      <b-button variant="outline-danger" :size="size" @click="deleteWrapper" v-if="confirmDialog">
        {{$root.l.confirm}}
      </b-button>
    </transition>
    <b-button variant="danger" :size="size" @click="confirmDialog = !confirmDialog">
      {{textOnButton}}
    </b-button>
  </b-button-group>
</template>

<script>
  export default {
    name: "DeleteButton",
    props: {
      onDelete: Function,
      text: {
        type: String,
        default: null
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
      textOnButton() {
        return (this.confirmDialog ? this.$root.l.cancel : this.deleteText)
      },
      deleteText() {
        return (this.text ? this.text : this.$root.l.delete)
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

<style lang="less" scoped>
  @import "../../style/transitions";
  .deleteButtonGroup {
    float: right;
  }

  .btn {
    margin-bottom: 0 !important;
  }

</style>
