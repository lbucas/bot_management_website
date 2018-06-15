<template>
    <div class="expandWrapper">
      <icon class="testttt" v-if="!expanded" icon="expand-button"/>
      <icon v-if="expanded" icon="expand-arrow"/>
    </div>
</template>

<script>
  import Icon from "./Icon"
  export default {
    name: "ExpandIcon",
    components: {Icon},
    props: {
      expanded: Boolean
    }
  }
</script>

<style scoped>
  .expandWrapper {
    display: inline;
    cursor: pointer;
  }

  .controlicon {
    cursor: pointer;
  }

</style>
