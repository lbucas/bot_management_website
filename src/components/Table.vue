<template>
  <div class="table-responsive">
    <table class="table table-hover">
      <thead v-if="head.length > 0">
        <tr>
          <th v-for="h in head">
            {{h}}
          </th>
        </tr>
      </thead>
      <tbody>
        <slot></slot>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: "Table",
    props: {
      head: {
        type: Array,
        default: () => { return [] }
      }
    }
  }
</script>
<style scoped>
  thead {
    font-size: 1rem;
  }

</style>
