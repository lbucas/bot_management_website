<template>
  <div>
    <MasterDetail tableheading="Available Databases" route="datasources">
      <b-tabs id="dsDetails">
        <b-tab class="tabTitle" title="General" active>
          <custom-form id="dsform" route="datasources">
            <form-row-input label="Title" model-key="name"/>
            <form-row-select model-key="datasourceTypeId"
                             :list="datasourcetypes" label="Database Type"/>
            <form-row-input label="Host" model-key="connectionObj.host" big/>
            <form-row-input label="Port" model-key="connectionObj.port"/>
            <form-row-input label="DB-Name" model-key="connectionObj.db"/>
            <form-row-input label="User" model-key="connectionObj.user"/>
            <form-row-input label="Password" model-key="connectionObj.password"
                            inputtype="password"/>
          </custom-form>
          <edit-button route="datasources"/>
          <b-button variant="primary" id="saveDS" @click="createOrEditDs" :disabled="!connectionTested"
                    v-if="onEdit" data-toggle="tooltip" data-placement="bottom"
                    title="Please test the connection first!">
            Save
          </b-button>
          <b-button variant="info" @click="testConnection" v-if="!connectionTested">
            {{connectionTestLabel}}
          </b-button>
          <b-button variant="success" v-if="connectionTested" @click="connectionTested=false">Success!
          </b-button>

          <delete-button :on-delete="deleteDS" v-if="!onEdit"/>
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
  import MasterDetail from '../../components/MasterDetail'
  import UpdateButton from "../../components/buttons/UpdateButton"
  import Loader from "../../components/Loader"
  import FormRowInput from "../../components/form/FormRowInput"
  import FormRowBlank from "../../components/form/FormRowBlank"
  import DeleteButton from "../../components/buttons/DeleteButton"
  import FormRowSelect from "../../components/form/FormRowSelect"
  import CustomForm from "../../components/form/CustomForm"
  import ExpandIcon from "../../components/ExpandIcon"
  import CancelButton from "../../components/buttons/CancelButton"
  import StoreItems from '../../components/mixins/StoreItems'
  import EditButton from "../../components/buttons/EditButton"
  import FormRowFile from "./ExcelInput"

  export default {
    name: 'Databases',
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
      updateDS() {
        this.$store.dispatch('update', 'datasources')
      },
      createOrEditDs() {
        this.dsDetails.id ? this.editDs() : this.createDs()
      },
      getDsTypes() {
        this.$store.dispatch('load', 'datasourcetypes')
      },
      createDs() {
        let newDs = {}
        this.$tools.clone(newDs, this.dsDetails)
        delete newDs.tables
        this.$store.dispatch('create', {route: 'datasources', toCreate: newDs})
      },
      editDs() {
        let patched = {}
        this.$tools.clone(patched, this.dsDetails)
        delete patched.tables
        this.$store.dispatch('patch', {route: 'datasources', toPatch: patched})
      },
      deleteDS() {
        this.$store.dispatch('delete', {route: 'datasources', toDelete: this.dsDetails.id})
      },
      async testConnection() {
        this.connectionTestLabel = 'Testing..'
        let details = this.dsDetails.connectionObj
        details.datasourceTypeId = this.dsDetails.datasourceTypeId
        try {
          let res = await this.$store.dispatch('post', {route: 'dataSources/testconnection', toPost: details})
          this.connectionTestLabel = "Test Connection"
          this.connectionTested = true
          this.editLoading = false
        } catch (err) {
          this.connectionErr = err.responseJSON.error.message
          this.$roothis.modalOpen('connectionTestModal')
          this.connectionTestLabel = 'Test Connection'
          this.editLoading = false
        }
      },
      async updateTables() {
        let toPost = {datasourceId: this.dsDetails.id}
        this.tablesLoading = true
        await this.$store.dispatch('post', {route: 'datasources/updateTables', toPost: toPost})
        this.tablesLoading = false
        this.updateDS()
      },
      expandtable(id) {
        let e = this.expanded
        id in e ? this.$delete(e, id, true) : this.$set(e, id, true)
      },
      async updateAttributes(id) {
        let toPost = {tableId: id}
        this.$set(this.updatingAttr, id, true)
        await this.$store.dispatch('post', {route: 'tables/updateAttributes', toPost: toPost})
        this.$set(this.updatingAttr, id, false)
        this.updateDS()
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
  @import "../../assets/less/mixins";

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
