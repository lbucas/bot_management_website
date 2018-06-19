<template>
  <b-row>
    <b-col/>
    <b-col>
      <slot></slot>
    </b-col>
    <b-col></b-col>
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
