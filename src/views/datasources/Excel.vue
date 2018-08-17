<template>
  <master-detail :tableheading="l.excel" route="excelFiles"
                 :on-item-change="emptyParsedFile">
    <b-tabs>
      <b-tab class="tab-title" :title="$root.l.general">
        <div id="excelFileDetails">
          <scrollable pos="threeTab">
            <custom-form route="excelFiles">
              <fr-input model-key="name" :label="$root.l.title"/>
              <fr-display model-key="uploaded" :label="l.lastUpd" filter="date"/>
            </custom-form>
            <div v-if="onEdit">
              <excel-input v-model="parsedFile" v-if="!fileParsed"/>
              <div v-else>
                <h6>{{l.selTables}}</h6>
                <ul class="sheetList">
                  <li v-for="(sheet, sheetName) in parsedFile.sTables">
                    <b>{{sheetName}}</b>
                    <ul class="detectedTables">
                      <li v-for="(exTable, startCell) in sheet">
                        <b-form-checkbox v-model="exTable.selected">&#x2063;
                        </b-form-checkbox>
                        <span v-b-toggle="sheetName + '_' + startCell" class="exTableName"
                              @click="expand(sheetName + '_' + startCell)">
                      <expand-icon :expanded="(sheetName+'_'+startCell in expanded)"/>
                      <span>{{exTable.startCell + ':' + exTable.endCell}}</span>
                      <span v-if="exTable.name"> - {{exTable.name}}</span>
                    </span>
                        <b-collapse :id="sheetName + '_' + startCell" class="mt-2">
                          <b-form-group :label="l.tabName" horizontal>
                            <b-form-input v-model="exTable.name"/>
                          </b-form-group>
                          <b-form-group :label="l.tabHeaders" horizontal>
                            <b-form-input readonly plaintext v-model="exTable.headers.join(', ')"/>
                          </b-form-group>
                          <b-form-group :label="l.tabEntries" horizontal>
                            <b-form-input readonly plaintext v-model="exTable.entries"/>
                          </b-form-group>

                        </b-collapse>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </scrollable>
          <edit route="excelFiles"/>
          <delete :on-delete="deleteExcel" v-if="!onEdit"/>
          <save :on-save="importExcel" :disabled="!importable" text="Import" v-if="fileParsed"/>
          <cancel :on-cancel="emptyParsedFile" route="excelFiles" v-if="fileParsed"/>
          <cancel route="excelFiles" v-else/>
        </div>
      </b-tab>
      <b-tab class="tabTitle" :title="l.tables" v-if="!onEdit">
        <scrollable pos="twoTab">
          <tables :excelFile="file.id"/>
        </scrollable>
      </b-tab>
    </b-tabs>

  </master-detail>
</template>

<script>
  import ExcelInput from "./ExcelInput"
  import ExpandIcon from "../../components/ExpandIcon"
  import Expandable from "../../components/mixins/Expandable"
  import Tables from "../../components/Tables"

  export default {
    name: "ExcelFiles",
    components: {Tables, ExcelInput, ExpandIcon},
    mixins: [Expandable],
    data() {
      return {
        parsedFile: {}
      }
    },
    computed: {
      l() {
        return this.$store.state.lang.datasources
      },
      onEdit() {
        return this.$store.state.onEdit.excelFiles
      },
      excelDetail() {
        return this.$store.state.detailItem.excelFiles
      },
      file() {
        return this.$store.state.detailItem.excelFiles
      },
      fileParsed() {
        return Object.keys(this.parsedFile).length > 0
      },
      selectedTables() {
        let st = {}
        for (let sheetname in this.parsedFile.sTables) {
          let sheet = this.parsedFile.sTables[sheetname]
          for (let startCell in sheet) {
            let exTable = sheet[startCell]
            if (exTable.selected) {
              st[sheetname] = st[sheetname] || {}
              st[sheetname][startCell] = exTable
            }
          }
        }
        return st
      },
      importable() {
        return this.fileParsed && Object.keys(this.selectedTables).length > 0 && this.file.name
      }
    },
    created() {
      this.$store.dispatch('load', 'excelFiles')
    },
    methods: {
      deleteExcel() {
        this.$store.dispatch('delete', {route: 'excelFiles', toDelete: this.file.id})
      },
      async importExcel() {
        let st = this.$store
        let toSend = this.parsedFile.excelObj
        toSend.sTables = this.selectedTables
        toSend.name = this.file.name
        toSend.id = this.file.id
        if (this.file.id) {
          st.dispatch('patch', {route: `excelFiles`, toPatch: toSend})
        } else {
          st.dispatch('create', {route: 'excelFiles', toCreate: toSend})
        }
        this.emptyParsedFile()
      },
      emptyParsedFile() {
        this.expanded = {}
        this.parsedFile = {}
      }
    }
  }
</script>

<style lang="less">
  @import "../../style/mixins";

  #excelFileDetails {
    .detectedTables {
      #noUserSelect;
      list-style: none;
      padding-left: .5rem;
    }

    .sheetList {
      list-style: none;
      padding-left: 0;
      li {
        padding: 0 0 .5rem 0;
      }
    }

    fieldset {
      margin-bottom: 0;
    }
  }


</style>
