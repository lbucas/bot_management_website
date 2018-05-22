<template>
  <MasterDetail :addnew="addIntent" tableheading="Intents">
    <tbody slot="table">
    <tr v-for="intent in intents">
      <td>{{intent.name}}</td>
    </tr>
    </tbody>

    <div slot="detail">
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
      p <br>
    </div>
  </MasterDetail>

</template>

<script>
  import MasterDetail from '../components/MasterDetail.vue'

  export default {
    components: {
      MasterDetail
    },
    name: "intents",
    data() {
      return {
        intents: [
          {
            name: 'Intent 1'
          },
          {
            name: 'Intent 2'
          },
          {
            name: 'Intent 3'
          }
        ]
      }
    },
    methods: {
      addIntent() {}
    }
  }
</script>


<style scoped>

</style>
