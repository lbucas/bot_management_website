<template>
  <img :src="(require('../assets/icons/'+icon+'.svg'))"/>
</template>

<script>
  export default {
    name: "icon",
    props: {
      icon: String
    }
  }
</script>

<style scoped>
  img {
    width: 1em;
  }

</style>
