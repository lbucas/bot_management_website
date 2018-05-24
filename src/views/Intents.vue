<template>
  <MasterDetail :addnew="addIntent" tableheading="Intents" :selected="chooseIntent" :tablecontent="intents">

    <div >
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
            id: 'i1',
            name: 'Intent 1'
          },
          {
            id: 'i2',
            name: 'Intent 2'
          },
          {
            id: 'i3',
            name: 'Intent 3'
          }
        ]
      }
    },
    methods: {
      addIntent() {},
      chooseIntent(i) {}
    }
  }
</script>


<style scoped>

</style>
