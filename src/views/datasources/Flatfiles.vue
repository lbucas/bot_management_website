<template>
  <master-detail tableheading="Available Flat Files" route="flatfiles">
    <b-row id="excelFileDetails">
      <b-col>
        <custom-form route="flatfiles">
          <fr-input model-key="name" label="Title"/>
          <fr-display model-key="uploaded" label="Last updated" filter="date"/>
        </custom-form>
        <div v-if="onEdit">
          <file-input v-model="file.name" :options="options" :uploaded="fileUploaded">
            <div>
              <icon icon="file" size="xl"/>
              <div class="dz-message">Click or drop .csv, .tsv, or .json here to upload</div>
            </div>
          </file-input>
        </div>
        <edit route="flatfiles" v-if="!onEdit"/>
        <delete :on-delete="deleteFlatfile" v-if="!onEdit"/>
        <cancel route="flatfiles" v-if="onEdit"/>
      </b-col>
    </b-row>
    </master-detail>
</template>

<script>
  import FileInput from "../../components/FileInput"
  import FormRowInput from "../../components/form/FormRowInput"
  import FormRowDisplay from "../../components/form/FormRowDisplay"
  import CustomForm from "../../components/form/CustomForm"
  import EditButton from "../../components/buttons/EditButton"
  import DeleteButton from "../../components/buttons/DeleteButton"
  import CancelButton from "../../components/buttons/CancelButton"
  import Masterdetail from "../../components/MasterDetail"
  import Icon from "../../components/Icon"

  export default {
    name: "Flatfiles",
    components: {
      FileInput
    },
    computed: {
      file() {
        return this.$store.state.detailItem.flatfiles
      },
      onEdit() {
        return this.$store.state.onEdit.flatfiles
      },
      options() {
        let api = this.$store.state.api
        let file = this.file || {}
        return {
          url() {
            return file.id
              ? `${api.url()}flatfiles/${file.id}/analyze?access_token=${api.token}&projectId=${api.projectId}`
              : `${api.url()}flatfiles/analyze?access_token=${api.token}&projectId=${api.projectId}`
          },
          paramName: 'file'
        }
      }
    },
    methods: {
      fileUploaded(file, status, xhr) {
        // TODO
      },
      deleteFlatfile() {
        // TODO
      }
    }
  }
</script>

<style scoped>

</style>
