<template>
  <p v-if="src && src != '{}'">
    <b>{{desc}}:</b>
    {{src}}
  </p>
</template>

<script>
  export default {
    name: "ErrorDisplay",
    props: {
      src: String,
      desc: String
    }
  }
</script>

<style scoped>
  p {
    width: 100%;
    overflow-x: auto;
  }

</style>
