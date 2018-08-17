<template>
  <b-button variant="primary" :size="size" :variant="variant" @click="startUpdate" :disabled="spinning">
    <img class="updateImg" src="../../assets/icons/update.svg" v-if="iconVisible && !spinning && !done"/>
    <img class="updateImg" src="../../assets/icons/updating.svg" v-if="iconVisible && spinning" :size="size"
         :variant="variant"/>
    <img class="updateImg" src="../../assets/icons/done.svg" v-if="iconVisible && done && !spinning" :size="size"
         :variant="variant"/>
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
      },
      iconVisible: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        done: false,
        clickedByUser: false
      }
    },
    computed: {
      spinning() {
        return this.loading
      }
    },
    methods: {
      startUpdate() {
        this.clickedByUser = true
        this.update()
      }
    },
    watch: {
      loading(l) {
        var t = this
        if (t.clickedByUser) {
          t.done = true
          setTimeout(() => {
            t.done = false
          }, 2000)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .updateImg {
    width: 1.3em;
  }

</style>
