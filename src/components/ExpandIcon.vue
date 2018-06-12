<template>
    <div class="expandWrapper">
      <img v-if="!expanded" class="controlicon" src="../assets/icons/expand-button.svg"/>
      <img v-if="expanded" class="controlicon" src="../assets/icons/expand-arrow.svg"/>
    </div>
</template>

<script>
  export default {
    name: "ExpandIcon",
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
