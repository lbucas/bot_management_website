<template>
  <master-detail :tableheading="l.flatfiles" route="flatfiles">
    <b-tabs>
      <b-tab class="tabTitle" :title="$root.l.general">
        <scrollable pos="threeTab">
          <b-row id="excelFileDetails">
            <b-col>
              <custom-form route="flatfiles">
                <fr-input model-key="name" label="Title"/>
                <fr-display model-key="uploaded" :label="l.lastUpd" filter="date"/>
              </custom-form>
              <div v-if="onEdit">
                <file-input v-model="file.name" :options="options" :uploaded="fileUploaded">
                  <div>
                    <icon icon="file" size="xl"/>
                    <div class="dz-message">{{l.uploadFlatfile}}</div>
                  </div>
                </file-input>
              </div>
            </b-col>
          </b-row>
        </scrollable>
        <edit route="flatfiles" v-if="!onEdit"/>
        <delete :on-delete="deleteFlatfile" v-if="!onEdit"/>
        <cancel route="flatfiles" v-if="onEdit"/>
      </b-tab>
      <b-tab class="tabTitle" :title="l.tables" v-if="!onEdit">
        <scrollable pos="twoTab">
          <tables :flatfile="file.id"/>
        </scrollable>
      </b-tab>
    </b-tabs>

  </master-detail>
</template>

<script>
  import FileInput from "../../components/FileInput"
  import Tables from "../../components/Tables"

  export default {
    name: "Flatfiles",
    components: {
      Tables,
      FileInput
    },
    computed: {
      l() {
        return this.$store.state.lang.datasources
      },
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
              : `${api.url()}flatfiles/upload?access_token=${api.token}&projectId=${api.projectId}` +
              `&name=${file.name}`
          },
          paramName: 'file'
        }
      }
    },
    methods: {
      fileUploaded(file, status, xhr) {
        let st = this.$store
        let res = JSON.parse(xhr.response)
        let ff = {}
        ff[res.id] = res
        if (status === 'success') {
          let route = 'flatfiles'
          st.commit('set', {route, item: ff})
          st.commit('endEditing', route)
          st.commit('setDetailItem', {route, item: res})
        } else {
          let error = {
            status: xhr.status,
            message: res.message,
            route: 'Flatfiles'
          }
          st.dispatch('errorHandling', {route: 'flatfiles', error})
        }
      },
      deleteFlatfile() {
        this.$store.dispatch('delete', {route: 'flatfiles', toDelete: this.file.id})
      }
    },
    created() {
      this.$store.dispatch('load', 'flatfiles')
    }
  }
</script>

<style scoped>

</style>
