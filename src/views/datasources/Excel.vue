<template>
  <masterdetail tableheading="Available Excel Files" route="excelFiles">
    <b-row>
      <b-col>
        <custom-form route="excelFiles">
          <form-row-input model-key="name" label="Title"/>
        </custom-form>
        <file-input v-if="onEdit"/>
        <edit-button route="excelFiles"/>
        <delete-button :on-delete="deleteExcel" v-if="!onEdit"/>
        <save-button :on-save="updateExcel" v-if="onEdit"/>
        <cancel-button route="excelFiles" v-if="onEdit"/>
      </b-col>
    </b-row>
  </masterdetail>
</template>

<script>
  import Masterdetail from "../../components/MasterDetail"
  import CustomForm from "../../components/form/CustomForm"
  import FileInput from "./ExcelInput"
  import FormRowInput from "../../components/form/FormRowInput"
  import EditButton from "../../components/buttons/EditButton"
  import DeleteButton from "../../components/buttons/DeleteButton"
  import SaveButton from "../../components/buttons/SaveButton"
  import CancelButton from "../../components/buttons/CancelButton"

  export default {
    name: "ExcelFiles",
    components: {
      CancelButton,
      SaveButton,
      DeleteButton,
      EditButton,
      FormRowInput,
      FileInput,
      CustomForm,
      Masterdetail
    },
    data() {
      return {}
    },
    computed: {
      onEdit() {
        return this.$store.state.onEdit.excelFiles
      },
      excelDetail() {
        return this.$store.state.detailItem.excelFiles
      }
    },
    created() {
      this.$store.dispatch('load', 'excelFiles')
    },
    methods: {
      deleteExcel() {
        //
      },
      updateExcel() {
        //
      }
    },
    watch: {}
  }
</script>

<style scoped>


</style>
