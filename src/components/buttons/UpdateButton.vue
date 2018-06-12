<template>
  <b-button variant="primary" :size="size" :variant="variant" @click="startUpdate">
    <img class="updateImg" src="../../assets/icons/update.svg" v-if="!spinning && !done"/>
    <img class="updateImg" src="../../assets/icons/updating.svg" v-if="spinning" :size="size" :variant="variant"/>
    <img class="updateImg" src="../../assets/icons/done.svg" v-if="done && !spinning" :size="size" :variant="variant"/>
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
    data() {
      return {
        done: false
      }
    },
    computed: {
      spinning() {
        return this.loading
      }
    },
    methods: {
      startUpdate() {
        this.update()
      }
    },
    watch: {
      loading(l) {
        var t = this
        t.done = true
        setTimeout(() => {
          t.done = false
        }, 1000)
      }
    }
  }
</script>

<style lang="less" scoped>
  .updateImg {
    width: 1.3em;
  }

</style>
