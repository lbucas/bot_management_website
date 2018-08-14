<template>
  <h5>
    <b-badge v-for="(v,i) in values">
      {{v}}
      <span class="removeFromList" @click="remove(i)">×</span>
    </b-badge>
  </h5>
</template>

<script>
  export default {
    name: "Badges",
    props: {
      values: Array,
      remove: Function
    }
  }
</script>

<style lang="less" scoped>
  @import "../style/mixins";
  @import "../style/colors";

  h5 {
    padding-top: .5rem;
    .badge {
      #noUserSelect;
      margin: .25rem .25rem .25rem .25rem;
      background: white;
      color: @richPurple;
      border: 1px solid @richPurple;
      .removeFromList {
        cursor: pointer;
      }
    }
  }
</style>
