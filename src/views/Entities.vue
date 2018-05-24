<template>
  <div>
    <MasterDetail tableheading="Entities" :tablecontent="entities" :selected="chooseEntity">
    </MasterDetail>
  </div>

</template>

<script>
  import MasterDetail from '../components/MasterDetail.vue'

  export default {
    components: {
      MasterDetail
    },
    name: "entities",
    data() {
      return {
        entities: [
          {
            id: 'e1',
            name: 'Entity 1'
          },
          {
            id: 'e2',
            name: 'Entity 3'
          },
          {
            id: 'e3',
            name: 'Entity 3'
          },
          {
            id: 'e4',
            name: 'Entity 4'
          }
        ]
      }
    },
    methods: {
      chooseEntity(e) {
        console.log(e)
      }
    }
  }
</script>

<style scoped>

</style>
