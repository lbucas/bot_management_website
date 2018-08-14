<template>
  <div>
    <!--  <icon v-if="file.uploaded" icon="donePurple"/>
    <icon v-if="!file.uploaded" icon="uploading"/> -->
    <file-input :options="options" :uploaded="fileUploaded" v-model="file.name">
      <div>
        <icon icon="excelDark" size="xl"/>
        <div class="dz-message">{{$store.state.lang.datasources.exUploadHelp}}</div>
      </div>
    </file-input>

  </div>
</template>

<script>
  import FileInput from '../../components/FileInput'
  import Icon from "../../components/Icon"

  export default {
    name: "ExcelInput",
    components: {Icon, FileInput},
    props: {
      value: Object
    },
    computed: {
      options() {
        let api = this.$store.state.api
        let file = this.file || {}
        return {
          url() {
            return file.id
              ? `${api.url()}excelFiles/${file.id}/analyze?access_token=${api.token}&projectId=${api.projectId}`
              : `${api.url()}excelFiles/analyze?access_token=${api.token}&projectId=${api.projectId}`
          },
          paramName: 'file',
          acceptedFiles: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      },
      file() {
        return this.$store.state.detailItem.excelFiles
      },
      onEdit() {
        return this.$store.state.onEdit.excelFiles
      },
      parsedFile: {
        get() {
          return this.value
        },
        set(v) {
          this.$emit("input", v)
        }
      }
    },
    methods: {
      fileUploaded(file, status, xhr) {
        this.uploading = false
        if (status === 'success') {
          this.parsedFile = JSON.parse(xhr.response)
          // this.$store.commit('endEditing', 'excelFiles')
        }
      }
    }
  }
</script>

<style>

</style>
