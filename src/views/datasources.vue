<template>
  <div>
    <MasterDetail tableheading="Available Datasources" :addnew="addDs" :selected="chooseDs" :tablecontent="datasources"
                  :loading="loading" :manualchoose="manualDsChoose" :update="upadateDatasources">
      <b-tabs id="dsDetails">
        <b-tab class="tabTitle" title="General" active>
          <CustomForm id="dsform">
            <FormRowInput label="Title" v-model="dsDetails.name" :on-edit="onEdit"/>
            <FormRowInput label="DB-Name" v-model="dsDetails.connectionObj.db" :on-edit="onEdit"
                          :change="connectionNotTested"/>
            <FormRowSelect v-model="dsDetails.datasourceTypeId" :on-edit="onEdit" :list="datasourcetypes" label="Type"
                           :display-value="currentDsType" list-display-value="name" :change="connectionNotTested" />
            <FormRowInput label="Host" v-model="dsDetails.connectionObj.host" :on-edit="onEdit" big
                          :change="connectionNotTested"/>
            <FormRowInput label="Port" v-model="dsDetails.connectionObj.port" :on-edit="onEdit"
                          :change="connectionNotTested"/>
            <FormRowInput label="User" v-model="dsDetails.connectionObj.user" :on-edit="onEdit"
                          :change="connectionNotTested"/>
            <FormRowInput label="Password" v-model="dsDetails.connectionObj.password" :on-edit="onEdit"
                          inputtype="password"
                          :change="connectionNotTested"/>
          </CustomForm>
          <b-button variant="primary" @click="(onEdit=true)" v-if="!onEdit">Edit</b-button>
          <b-button variant="primary" id="saveDS" @click="createOrEditDs" :disabled="!connectionTested"
                    v-if="onEdit" data-toggle="tooltip" data-placement="bottom"
                    title="Please test the connection first!">
            Save
          </b-button>
          <b-button variant="info" @click="testConnection" v-if="!connectionTested">{{connectionTestLabel}}</b-button>
          <b-button variant="success" v-if="connectionTested" @click="connectionTested=false">Success!</b-button>

          <DeleteButton :on-delete="deleteDS" v-if="!onEdit"/>
          <b-button variant="secondary" v-if="(onEdit&&!dsDetails.id=='')"
                    @click="onEdit=false; chooseDs(datasources[activeId])">Cancel
          </b-button>
        </b-tab>
        <b-tab class="tabTitle" title="Tables" v-if="showTables">
          <table class="table" id="dsTables">
            <tbody>
            <tr v-if="dsDetails.tables.length == 0" class="noEntries">
              <td>No tables found for this datasource</td>
            </tr>
            <tr v-for="(t, id) in dsDetails.tables">
              <td>
                <span v-b-toggle="'tables' + id" @click="expandtable(id)">
                  <img v-if="!(id in expanded)" class="controlicon" src="../assets/icons/expand-button.svg"/>
                  <img v-if="(id in expanded)" class="controlicon" src="../assets/icons/expand-arrow.svg"/>
                  {{t.name}}
                </span>
                <b-collapse v-bind:id="'tables' + id" class="mt-2">
                  <ul>
                    <li v-if="t.attributes.length == 0" class="noEntries">No attributes found for this table</li>
                    <li v-for="a in t.attributes">
                      {{a.name}} ({{a.datatype}})
                    </li>
                    <li>
                      <UpdateButton class="updateAttribute" text="Update Attributes"
                                    :update="function(){(updateAttributes(t.id))}"
                                    :loading="upadatingAttr[t.id] || false" size="sm"/>
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
  import UpdateButton from "../components/UpdateButton"
  import Loader from "../components/Loader"
  import FormRowInput from "../components/FormRowInput"
  import FormRowBlank from "../components/FormRowBlank"
  import DeleteButton from "../components/DeleteButton"
  import FormRowSelect from "../components/FormRowSelect"
  import CustomForm from "../components/CustomForm"

  export default {
    name: 'datasources',
    components: {
      CustomForm,
      FormRowSelect,
      DeleteButton,
      FormRowBlank,
      FormRowInput,
      UpdateButton,
      MasterDetail,
      Loader
    },
    data() {
      return {
        datasources: {},
        datasourcetypes: {},
        loading: true,
        dsSelected: false,
        onEdit: false,
        showTables: true,
        dsDetails: {
          name: '',
          datasourceTypeId: "",
          connectionObj: {
            host: "",
            db: "",
            user: "",
            password: "",
            port: ""
          },
          tables: []
        },
        connectionTested: false,
        activeId: "",
        manualDsChoose: '',
        connectionTestLabel: 'Test Connection',
        connectionErr: '',
        expanded: {},
        upadatingAttr: {},
        tablesLoading: false
      }
    },
    methods: {
      getDS(showAfterLoading) {
        var t = this
        t.loading = true
        this.$root.getAndSet(
          'projects/--projectid--/dataSources',
          t.datasources,
          function (d) {
            // array to object
            return d
          },
          function () {
            t.loading = false
            t.tablesLoading = false
            for (let tid in t.upadatingAttr) {
              t.upadatingAttr[tid] = false
            }
            if (showAfterLoading) {
              t.manualDsChoose = showAfterLoading
            }
          },
          {filter: {include: {tables: "attributes"}}}
        )
      },
      upadateDatasources() {
        this.getDS(this.dsDetails.id)
      },
      createOrEditDs() {
        if (this.activeId === '') {
          this.createDs()
        } else {
          this.patchDs()
        }
      },
      getDsTypes() {
        var t = this
        this.$root.getAndSet(
          'datasourceTypes',
          t.datasourcetypes
        )
      },
      chooseDs(ds) {
        this.$root.clone(this.dsDetails, ds)
        this.showTables = true
        this.onEdit = false
        this.activeId = ds.id
      },
      addDs() {
        this.onEdit = true
        this.dsSelected = true
        this.dsDetails = {
          name: '',
          datasourceTypeId: '5b0435bc41b70a008681ddc7',
          connectionObj: {
            host: '',
            user: '',
            password: '',
            port: '',
            db: ''
          }
        }
        this.showTables = false
        this.activeId = ""
      },
      createDs() {
        var t = this
        t.editLoading = true
        this.$root.post(
          'projects/--projectid--/dataSources',
          t.dsDetails,
          function (res) {
            t.getDS(res.id)
          }
        )
      },
      patchDs() {
        var t = this
        var patched = {}
        this.$root.clone(patched, this.dsDetails)
        delete patched.tables
        t.editLoading = true
        this.$root.patch(
          'datasources/' + t.activeId,
          patched,
          function (res) {
            t.getDS(t.activeId)
          }
        )
      },
      deleteDS() {
        var t = this
        t.loading = true
        t.$root.delete(
          'datasources',
          t.dsDetails.id,
          function () {
            t.getDS('')
          }
        )
      },
      testConnection() {
        var t = this
        t.connectionTestLabel = 'Testing..'
        t.editLoading = true
        var details = t.dsDetails.connectionObj
        details.datasourceTypeId = t.dsDetails.datasourceTypeId
        this.$root.post(
          'dataSources/testconnection',
          details,
          function (res) {
            t.connectionTestLabel = "Test Connection"
            t.connectionTested = true
            t.editLoading = false
          },
          function (err) {
            t.connectionErr = err.responseJSON.error.message
            t.$root.modalOpen('connectionTestModal')
            t.connectionTestLabel = 'Test Connection'
            t.editLoading = false
          }
        )
      },
      updateTables() {
        this.tablesLoading = true
        var t = this
        this.$root.post(
          'datasources/updateTables',
          {datasourceId: t.dsDetails.id},
          function () {
            t.getDS(t.dsDetails.id)
          }
        )
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
        t.upadatingAttr[id] = true
        this.$root.post(
          'tables/updateAttributes',
          {tableId: id},
          function () {
            t.getDS(t.dsDetails.id)
          }
        )
      },
      connectionNotTested() {
        this.connectionTested = false
      }
    },
    created() {
      this.getDS()
      this.getDsTypes()
    },
    computed: {
      currentDsType() {
        let dsid = this.dsDetails.datasourceTypeId
        try {
          return this.datasourcetypes[dsid]['name']
        } catch (e) {
          return ''
        }
      }
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

  #dsform {
    margin-top: 1em;
  }

  .nav-tabs {
    a {
      color: black !important;
    }
  }

  #tables {
    margin-top: 1em;
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
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
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
