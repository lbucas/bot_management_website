<template>
  <div>
    <div id="uploadProgress" v-if="uploading">
      <b-progress v-if="!fileIsProcessing" :value="progress" :max="1" show-progress animated/>
      <p v-else>The file is being processed..</p>
    </div>
    <vue-clip :options="options" :on-added-file="fileAdded" :on-complete="uploaded" :on-sending="beforeFileSend"
              :on-total-progress="totalProgress">
      <template slot="clip-uploader-action">
        <slot/>
      </template>
    </vue-clip>
  </div>
</template>

<script>
  import Icon from "./Icon"
  import FileInput from "./FileInput"

  export default {
    name: "fileInput",
    props: {
      options: Object,
      uploaded: Function,
      value: String
    },
    data() {
      return {
        // fileName: this.$props.value.fileName,
        // fileId: this.$props.value.fileId,
        progress: 0,
        uploading: false
      }
    },
    computed: {
      fileIsProcessing() {
        return (this.progress === 1 && this.uploading)
      }
    },
    methods: {
      fileAdded(file) {
        if (!this.value) this.$emit('input', file.name.split('.')[0])
      },
      beforeFileSend(file, xhr, formData) {
        this.uploading = true
      },
      totalProgress(progress, totalBytes, bytesSent) {
        this.progress = bytesSent / totalBytes
      }
    }
  }
</script>

<style lang="less">
  @import "../assets/less/mixins";
  @import "../assets/less/colors";
  @import "../assets/less/transitions";

  .dz-clickable {
    width: 100%;
    height: 9rem;
    border: 1px solid lightgrey;
    background: #f0ecf8;
    text-align: center;
    margin-bottom: 1rem;
    padding-top: 2rem;
    font-size: 1rem;
    cursor: pointer;
    &.dz-drag-hover {
      background: #e1d9f2;
    }
  }

  .uploadProgress {
    margin: 1rem 0 1rem 0;
  }

</style>
