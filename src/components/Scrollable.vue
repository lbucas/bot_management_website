<template>
  <div :class="classes">
    <slot/>
  </div>
</template>

<script>
  export default {
    name: "Scrollable",
    props: {
      pos: String
    },
    computed: {
      classes() {
        return `scrollable scroll-${this.pos}`
      }
    }
  }
</script>

<style scoped>
  .scrollable {
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 5px;
    width: 100%;
    margin-bottom: 1rem;
  }

  @media (min-width: 768.1px) {
    .scroll-oneTab {
      height: calc(100vh - 70px);
    }

    .scroll-twoTab {
      height: calc(100vh - 120px);
    }

    .scroll-threeTab {
      height: calc(100vh - 170px);
    }

    .scroll-full {
      height: calc(100vh - 10px);
    }
  }

</style>
