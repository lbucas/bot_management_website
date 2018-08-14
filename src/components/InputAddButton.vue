<template>
  <b-row>
    <b-col>
      <slot/>
    </b-col>
    <transition name="view" mode="out-in">
      <b-col v-if="showAdd" cols="1">
        <b-button variant="outline-primary" size="sm" @click="onAdd">+</b-button>
      </b-col>
    </transition>
  </b-row>
</template>

<script>
  export default {
    name: "InputAddButton",
    props: {
      showAdd: Boolean,
      onAdd: Function
    }
  }
</script>

<style lang="less" scoped>
  @import "../style/transitions";
</style>
