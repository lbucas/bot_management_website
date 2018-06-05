<template>
    <b-button variant="primary" :size="size" :variant="variant" @click="startUpdate">
      <img class="updateImg" src="../assets/icons/update.svg" v-if="!loading"/>
      <img class="updateImg" src="../assets/icons/updating.svg" v-if="loading" :size="size" :variant="variant"/>
      {{text}}
    </b-button>
</template>

<script>
  export default {
    name: "UpdateButton",
    props: {
      loading: Boolean,
      update: Function,
      variant: {
        type: String,
        default: 'primary'
      },
      size: {
        type: String,
        default: 'md'
      },
      text: {
        type: String,
        default: ''
      }
    },
    methods: {
      startUpdate() {
        this.update()
      }
    }
  }
</script>

<style lang="less" scoped>
  .updateImg {
    width: 1.3em;
  }

</style>
