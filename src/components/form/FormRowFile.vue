<template>
  <form-row-blank :label="label">
    <Table>
      <tr v-for="file in files">
        <td>
          {{file.name}}
          <Icon v-if="file.uploaded" icon="donePurple"/>
          <Icon v-if="!file.uploaded" icon="uploading"/>
        </td>
        <td>
          <delete-button v-if="file.uploaded" size="sm"/>
        </td>
      </tr>
    </Table>
    <vue-clip :options="options">
      <template slot="clip-uploader-action">
        <div>
          <Icon icon="excel" size="xl"/>
          <div class="dz-message">Click or Drag and Drop .xlsx files here to upload</div>
        </div>
      </template>
      <!-- <template slot="clip-uploader-body" scope="props">
        <div v-for="file in props.files">
          <img v-bind:src="file.dataUrl"/>
          {{ file.name }} {{ file.status }}
        </div>
      </template> -->
    </vue-clip>
  </form-row-blank>
</template>

<script>
  import FormRowBlank from "./FormRowBlank"
  import FormComponent from "../mixins/FormComponent"
  import Table from "../Table"
  import Icon from "../Icon"
  import DeleteButton from "../buttons/DeleteButton"

  export default {
    name: "FormRowFile",
    mixins: [FormComponent],
    components: {DeleteButton, Icon, Table, FormRowBlank},
    props: {
      value: {}
    },
    data() {
      return {
        fileName: this.$props.value.fileName,
        fileId: this.$props.value.fileId,
        options: {
          url: '/upload',
          paramName: 'file',
          acceptedFiles: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        files: {
          1: {
            name: 'test.xlxs',
            uploaded: true
          },
          2: {
            name: 'new.xlxs',
            uploaded: false
          }
        }
      }
    },
    computed: {
      target() {
        let api = this.$store.state.api
        return api.url() + '&access_token=' + api.token
      }
    },
    watch: {
      inputValue(v) {
        this.$emit("input", v)
        this.change()
      },
      value(v) {
        this.fileName = v.fileName
        this.fileId = v.fileId
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/less/mixins";
  @import "../../assets/less/colors";

  .dz-clickable {
    width: 100%;
    height: 9rem;
    border: 1px solid lightgrey;
    background: #f0ecf8 ;
    text-align: center;
    padding-top: 2rem;
    font-size: 1rem;
    cursor: pointer;
    &.dz-drag-hover {
      background: #e1d9f2;
    }
  }

</style>
