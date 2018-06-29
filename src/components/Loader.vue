<template>
  <div v-if="loading">
    <div  class="loaderOverlay">
    </div>
    <img class="loadingAnimation" src="../assets/icons/loading.svg">
  </div>
</template>

<script>
  export default {
    name: "Loader",
    props: {
      loading: {
        type: Boolean,
        default: true
      }
    }
  }
</script>

<style scoped>
  .loaderOverlay {
    position: absolute;
    display: block;
    width: 97%;
    height: 80%;
    z-index: 100;
    opacity: 0;
    background: #503291;
  }

  .loadingAnimation {
    position: absolute;
    height: 100px;
    display: block;
    margin-left: calc(50% - 50px);
    z-index: 100;
  }

</style>
