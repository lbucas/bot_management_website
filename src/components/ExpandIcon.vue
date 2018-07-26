<template>
    <div class="expandWrapper">
      <icon v-if="!expanded" icon="notExpanded"/>
      <icon v-if="expanded" icon="expanded"/>
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
