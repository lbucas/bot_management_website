<template>
  <b-row>
    <b-col class="text-center">
      <slot></slot>
    </b-col>
  </b-row>
</template>

<script>
  export default {
    name: "CenterButton"
  }
</script>

<style scoped>
  button{
    float: none !important;
  }

</style>
