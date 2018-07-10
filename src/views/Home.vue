<template>
  <div id="home">
    <h3>Welcome to your Bot Management Dashboard</h3>
  </div>

</template>

<script>
  import UpdateButton from "../components/buttons/UpdateButton"
  import CustomForm from "../components/form/CustomForm"
  import FormRowSelect from "../components/form/FormRowSelect"
  import FormRowInput from "../components/form/FormRowInput"
  export default {
    name: 'home',
    components: {FormRowInput, FormRowSelect, CustomForm, UpdateButton},
    data() {
      return {}
    },
    created() {}
  }
</script>

<style scoped>
  #home {
    text-align: center;
    padding-top: 3rem;
  }

</style>
