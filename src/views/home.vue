<template>
  <div>
    <custom-form>
      <form-row-select v-model="test" :list="list" suggestions />
      <form-row-select v-model="test" :list="list"/>
    </custom-form>
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
      return {
        test: 'abc',
        list: {
          'abc': {name: "Test"},
          'ab2': {name: "Test123"},
          'ab3': {name: "Test asf"},
          'ab4sad': {name: "Test zxc"},
          'ab4d': {name: "Test zxc"},
          'ab4s': {name: "Test zxc"},
          'ab4sa': {name: "Test zxc"},
          'ab4as': {name: "Test zxc"},
          'ab4r': {name: "Test zxc"},
          'ab4t': {name: "Test zxc"},
          'ab4y': {name: "Test zxc"},
          'ab4u': {name: "Test zxc"},
          'ab4i': {name: "Test zxc"},
          'ab4o': {name: "Test zxc"},
          'ab4k': {name: "Test zxc"},
          'ab4kn': {name: "Test zxc"},
          'ab4n': {name: "Test zxc"},
          'ab4m': {name: "Test zxc"},
          'ab4z': {name: "Test zxc"},
          'ab4x': {name: "Test zxc"},
          'abasdfsadf': {name: "Test zxc"},
          'abdsa': {name: "Test zxc"},
          'ab22x': {name: "Test zxc"}
        }
      }
    },
    created() {}
  }
</script>

<style scoped>

</style>
