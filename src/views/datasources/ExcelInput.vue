<template>
  <div>


    <!--  <Icon v-if="file.uploaded" icon="donePurple"/>
    <Icon v-if="!file.uploaded" icon="uploading"/> -->
    <b-progress v-if="uploading" :value="progress" :max="1" show-progress animated/>
    <vue-clip :options="options" :on-added-file="fileAdded" :on-complete="fileUploaded" :on-sending="beforeFileSend"
              :on-total-progress="totalProgress">
      <template slot="clip-uploader-action">
          <div>
            <Icon icon="excelDark" size="xl"/>
            <div class="dz-message">Click or Drag and Drop .xlsx files here to upload</div>
          </div>
      </template>
    </vue-clip>

  </div>
</template>

<script>
  import Table from "../../components/Table"
  import Icon from "../../components/Icon"
  import DeleteButton from "../../components/buttons/DeleteButton"

  export default {
    name: "ExcelInput",
    components: {DeleteButton, Icon, Table},
    data() {
      return {
        // fileName: this.$props.value.fileName,
        // fileId: this.$props.value.fileId,
        progress: 0,
        uploading: false,
        name: ''
      }
    },
    computed: {
      options() {
        let api = this.$store.state.api
        let file = this.file || {}
        return {
          url() {
            return file.id
              ? `${api.url()}excelFiles/${file.id}/upload?access_token=${api.token}&projectId=${api.projectId}`
              : `${api.url()}excelFiles/upload?access_token=${api.token}&projectId=${api.projectId}&name=${file.name}`
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
      }
    },
    methods: {
      fileAdded(file) {
        if (!this.file.name) this.file.name = file.name
      },
      beforeFileSend(file, xhr, formData) {
        this.uploading = true
        // formData.append('_projectId', this.$store.state.api.projectId)
      },
      fileUploaded(file, status, xhr) {
        setTimeout(() => {
          this.uploading = false
        }, 2000)
      },
      totalProgress(progress, totalBytes, bytesSent) {
        this.progress = bytesSent / totalBytes
        console.log(this.progress)
      }
    }
  }
</script>

<style lang="less">
  @import "../../assets/less/mixins";
  @import "../../assets/less/colors";
  @import "../../assets/less/transitions";

  .dz-clickable {
    width: 100%;
    height: 9rem;
    border: 1px solid lightgrey;
    background: #f0ecf8;
    text-align: center;
    padding-top: 2rem;
    font-size: 1rem;
    cursor: pointer;
    &.dz-drag-hover {
      background: #e1d9f2;
    }
  }

  .dz-message {

  }

</style>
