<template>
  <div>
    <MasterDetail tableheading="Available Datasources" route="datasources">
      <b-tabs id="dsDetails">
        <b-tab class="tabTitle" title="General" active>
          <custom-form id="dsform" :on-edit="onEdit">
            <form-row-input label="Title" v-model="dsDetails.name"/>
            <form-row-file v-if="isExcel" label="Files" v-model="demoV"/>
            <form-row-select v-if="!isExcel" v-model="dsDetails.datasourceTypeId" :on-edit="onEdit" :list="datasourcetypes" label="Type"
                           :change="connectionNotTested"/>
            <form-row-input v-if="!isExcel" label="Host" v-model="dsDetails.connectionObj.host" :on-edit="onEdit" big
                          :change="connectionNotTested"/>
            <form-row-input v-if="!isExcel" label="Port" v-model="dsDetails.connectionObj.port"
                          :change="connectionNotTested"/>
            <form-row-input v-if="!isExcel" label="DB-Name" v-model="dsDetails.connectionObj.db"
                          :change="connectionNotTested"/>
            <form-row-input v-if="!isExcel" label="User" v-model="dsDetails.connectionObj.user"
                          :change="connectionNotTested"/>
            <form-row-input v-if="!isExcel" label="Password" v-model="dsDetails.connectionObj.password"
                          inputtype="password"
                          :change="connectionNotTested"/>
          </custom-form>
          <edit-button route="datasources"/>
          <b-button variant="primary" id="saveDS" @click="createOrEditDs" :disabled="!connectionTested"
                    v-if="onEdit" data-toggle="tooltip" data-placement="bottom"
                    title="Please test the connection first!">
            Save
          </b-button>
          <b-button variant="info" @click="testConnection" v-if="!connectionTested && !isExcel">{{connectionTestLabel}}</b-button>
          <b-button variant="success" v-if="connectionTested" @click="connectionTested=false && !isExcel">Success!</b-button>

          <delete-button :on-delete="deleteDS" v-if="!onEdit && !isExcel"/>
          <cancel-button route="datasources"/>
        </b-tab>
        <b-tab class="tabTitle" title="Tables" v-if="!onEdit">
          <table class="table" id="dsTables">
            <tbody>
            <tr v-if="Object.keys(dsDetails.tables).length == 0" class="noEntries">
              <td>No tables found for this datasource</td>
            </tr>
            <tr v-for="(t, id) in dsDetails.tables">
              <td>
                <span v-b-toggle="'tables' + id" @click="expandtable(id)">
                  <expand-icon :expanded="(id in expanded)"/>
                  {{t.name}}
                </span>
                <b-collapse v-bind:id="'tables' + id" class="mt-2">
                  <ul>
                    <li v-if="Object.keys(t.attributes).length == 0" class="noEntries">No attributes found for this
                      table
                    </li>
                    <li v-for="a in t.attributes">
                      {{a.name}} ({{a.datatype}})
                    </li>
                    <li>
                      <UpdateButton class="updateAttribute" text="Update Attributes"
                                    :update="function(){(updateAttributes(t.id))}"
                                    :loading="updatingAttr[t.id] || tablesLoading || false" size="sm"/>
                    </li>
                  </ul>
                </b-collapse>
              </td>
            </tr>
            </tbody>
          </table>
          <UpdateButton :loading="tablesLoading" :update="updateTables" text="Update Tables"/>
        </b-tab>
      </b-tabs>
    </MasterDetail>
    <b-modal id="connectionTestModal" title="Connection Failed!">
      Connection to the database with the given credentials did not suceed.
      Error Message: <br><br>
      <p><em>{{connectionErr}}</em></p>
    </b-modal>
  </div>
</template>

<script>
  import MasterDetail from '../components/MasterDetail'
  import UpdateButton from "../components/buttons/UpdateButton"
  import Loader from "../components/Loader"
  import FormRowInput from "../components/form/FormRowInput"
  import FormRowBlank from "../components/form/FormRowBlank"
  import DeleteButton from "../components/buttons/DeleteButton"
  import FormRowSelect from "../components/form/FormRowSelect"
  import CustomForm from "../components/form/CustomForm"
  import ExpandIcon from "../components/ExpandIcon"
  import CancelButton from "../components/buttons/CancelButton"
  import StoreItems from '../components/mixins/StoreItems'
  import EditButton from "../components/buttons/EditButton"
  import FormRowFile from "../components/form/FormRowFile"

  export default {
    name: 'Datasources',
    components: {
      FormRowFile,
      EditButton,
      CancelButton,
      ExpandIcon,
      CustomForm,
      FormRowSelect,
      DeleteButton,
      FormRowBlank,
      FormRowInput,
      UpdateButton,
      MasterDetail,
      Loader
    },
    mixins: [StoreItems],
    data() {
      return {
        connectionTested: false,
        connectionErr: '',
        expanded: {},
        updatingAttr: {},
        tablesLoading: false,
        isExcel: true,
        demoV: {fileName: 'a', fileId: 'b'},
        connectionTestLabel: 'Test Connection'
      }
    },
    computed: {
      loading() {
        return this.$store.state.loaders.datasources
      },
      dsDetails() {
        return this.$store.state.detailItem.datasources
      },
      onEdit() {
        return this.$store.state.onEdit.datasources
      },
      currentDsType() {
        let dsid = this.dsDetails.datasourceTypeId
        try {
          return this.datasourcetypes[dsid]['name']
        } catch (e) {
          return ''
        }
      }
    },
    methods: {
      getDS() {
        this.$store.dispatch('load', 'datasources')
      },
      updateDS(showAfterLoading) {
        var t = this
        this.$store.dispatch('update', 'datasources')
      },
      createOrEditDs() {
        if (this.dsDetails.id) {
          this.editDs()
        } else {
          this.createDs()
        }
      },
      getDsTypes() {
        this.$store.dispatch('load', 'datasourcetypes')
      },
      createDs() {
        this.$store.dispatch('create', {route: 'datasources', toCreate: this.dsDetails})
      },
      editDs() {
        var t = this
        var patched = {}
        this.$root.clone(patched, this.dsDetails)
        delete patched.tables
        this.$store.dispatch('patch', {route: 'datasources', toPatch: patched})
      },
      deleteDS() {
        this.$store.dispatch('delete', {route: 'datasources', toDelete: this.dsDetails.id})
      },
      testConnection() {
        var t = this
        t.connectionTestLabel = 'Testing..'
        var details = t.dsDetails.connectionObj
        details.datasourceTypeId = t.dsDetails.datasourceTypeId
        this.$store.dispatch('post', {route: 'dataSources/testconnection', toPost: details})
          .then((res) => {
            t.connectionTestLabel = "Test Connection"
            t.connectionTested = true
            t.editLoading = false
          }, (err) => {
            t.connectionErr = err.responseJSON.error.message
            t.$root.modalOpen('connectionTestModal')
            t.connectionTestLabel = 'Test Connection'
            t.editLoading = false
          })
      },
      updateTables() {
        var t = this
        let toPost = {datasourceId: t.dsDetails.id}
        this.tablesLoading = true
        this.$store.dispatch('post', {route: 'datasources/updateTables', toPost: toPost})
          .then(() => {
            t.tablesLoading = false
            t.updateDS()
          })
      },
      expandtable(id) {
        var e = this.expanded
        if (id in e) {
          this.$delete(e, id, true)
        } else {
          this.$set(e, id, true)
        }
      },
      updateAttributes(id) {
        var t = this
        let toPost = {tableId: id}
        this.$set(this.updatingAttr, id, true)
        this.$store.dispatch('post', {route: 'tables/updateAttributes', toPost: toPost})
          .then(() => {
            this.$set(this.updatingAttr, id, false)
            t.updateDS()
          })
      },
      connectionNotTested() {
        this.connectionTested = false
      }
    },
    created() {
      this.getDS()
      this.getDsTypes()
    },
    watch: {
      dsDetails() {
        this.connectionTested = false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import "../assets/less/mixins";

  .nav-tabs {
    a {
      color: black !important;
    }
  }

  #tables {
    list-style: none;
    .tablename {
      cursor: pointer;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  }

  #connectionTestModal {
    .btn-secondary {
      display: none;
    }
  }

  #dsTables {
    span {
      cursor: pointer;
      #noUserSelect
    }
    ul {
      list-style: none;
      padding-left: 0;

    }
    li {
      padding-left: 1em;
    }
    .noEntries {
      font-style: italic;
      font-weight: 300;
      margin-top: .5em;
    }
    .updateAttribute {
      float: left !important;
      margin-top: .8em;
    }
  }


</style>
