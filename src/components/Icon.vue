<template>
  <img :src="(require('../assets/icons/'+icon+'.svg'))" :class="size"/>
</template>

<script>
  export default {
    name: "icon",
    props: {
      icon: String,
      size: {
        type: String,
        default: 'md'
      }
    }
  }
</script>

<style lang="less" scoped>
  img {
    width: 1rem;
    &.xl {
      width: 3rem !important;
    }
  }

</style>
