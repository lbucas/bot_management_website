<template>
  <div>
    <MasterDetail tableheading="Available Datasources" :addnew="addDs" :selected="chooseDs" :tablecontent="datasources"
                  :loading="loading" :manualchoose="manualDsChoose">
      <b-tabs id="dsDetails">
        <b-tab class="tabTitle" title="General" active>
          <form id="dsform">
            <Loader :loading="editLoading"></Loader>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Title</label>
              <div class="col-sm-10">
                <input type="text" v-bind:readonly="!onEdit"
                       v-bind:class="{ 'form-control-plaintext': !onEdit, 'form-control': onEdit }"
                       v-model="dsDetails.name">
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">DB-Name</label>
              <div class="col-sm-10">
                <input type="text" v-bind:readonly="!onEdit"
                       v-bind:class="{ 'form-control-plaintext': !onEdit, 'form-control': onEdit }"
                       v-model="dsDetails.connectionObj.db" @input="connectionTested=false">
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Type</label>
              <div class="col-sm-10">
                <input v-if="!onEdit" type="text" readonly class="form-control-plaintext" v-model="currentDsType">
                <select class="form-control" v-if="onEdit" v-model="dsDetails.datasourceTypeId"
                        @input="connectionTested=false">
                  <option v-for="(type, id) in datasourcetypes" v-bind:value="id">{{type.name}}</option>
                </select>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Host-URL</label>
              <div class="col-sm-10">
                <input type="text" v-bind:readonly="!onEdit"
                       v-bind:class="{ 'form-control-plaintext': !onEdit, 'form-control': onEdit }"
                       v-model="dsDetails.connectionObj.host" @input="connectionTested=false">
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Port</label>
              <div class="col-sm-10">
                <input type="text" v-bind:readonly="!onEdit"
                       v-bind:class="{ 'form-control-plaintext': !onEdit, 'form-control': onEdit }"
                       v-model="dsDetails.connectionObj.port" @input="connectionTested=false">
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">User</label>
              <div class="col-sm-10">
                <input type="text" v-bind:readonly="!onEdit"
                       v-bind:class="{ 'form-control-plaintext': !onEdit, 'form-control': onEdit }"
                       v-model="dsDetails.connectionObj.user" @input="connectionTested=false">
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Password</label>
              <div class="col-sm-10">
                <input type="password" v-bind:readonly="!onEdit"
                       v-bind:class="{ 'form-control-plaintext': !onEdit, 'form-control': onEdit }"
                       v-model="dsDetails.connectionObj.password" @input="connectionTested=false">
              </div>
            </div>
          </form>
          <b-button variant="primary" @click="(onEdit=true)" v-if="!onEdit">Edit</b-button>
          <b-button variant="primary" id="saveDS" @click="createOrEditDs" v-bind:disabled="!connectionTested"
                    v-if="onEdit" data-toggle="tooltip" data-placement="bottom"
                    title="Please test the connection first!">
            Save
          </b-button>
          <b-button variant="info" @click="testConnection" v-if="!connectionTested">{{connectionTestLabel}}</b-button>
          <b-button variant="success" v-if="connectionTested" @click="connectionTested=false">Success!</b-button>
          <b-button variant="secondary" v-if="(onEdit&&!dsDetails.id=='')" @click="onEdit=false; chooseDs(datasources[activeId])">Cancel</b-button>
        </b-tab>
        <b-tab class="tabTitle" title="Tables" v-if="showTables">
          <ul id="tables" v-for="tab in dsDetails.tables">
            <li>
                <span @click="expandtable(tab.id)" class="tablename">
                  <img v-if="!(expanded == tab.id)" class="controlicon" src="../assets/icons/expand-button.svg"/>
                  <img v-if="expanded == tab.id" class="controlicon" src="../assets/icons/expand-arrow.svg"/>
                  {{tab.name}}
                </span>
              <ul v-if="expanded == tab.id" v-for="att in tab.attributes">
                <li>
                  <span>{{att.name}} ({{att.type}}) </span>
                  <span v-if="!(att.entity==null)">linked to {{att.entity}}</span>
                </li>
              </ul>
            </li>
          </ul>
          <b-button variant="primary" @click="updateTables">Import/Update tables</b-button>
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
  import Loader from "../components/Loader"

  export default {
    name: 'datasources',
    components: {
      Loader,
      MasterDetail
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
          tables: [
            {
              id: '1',
              name: "table1",
              attributes: [
                {
                  id: '5',
                  name: "attr1",
                  entity: "ent1"
                },
                {
                  id: '6',
                  name: "attr2",
                  entity: null
                }
              ]
            },
            {
              id: '10',
              name: "table1",
              attributes: [
                {
                  id: '3b',
                  name: "attr1",
                  entity: "ent1"
                },
                {
                  id: '4r',
                  name: "attr2",
                  entity: null
                }
              ]
            }
          ]
        },
        connectionTested: false,
        activeId: "",
        expanded: "",
        manualDsChoose: '',
        editLoading: false,
        connectionTestLabel: 'Test Connection',
        connectionErr: ''
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
            if (showAfterLoading) {
              t.manualDsChoose = showAfterLoading
            }
          }
        )
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
            t.$set(t.datasources, res.id, res)
            t.manualDsChoose = res.id
            t.editLoading = false
          }
        )
      },
      patchDs() {
        var t = this
        delete t.dsDetails.tables
        t.editLoading = true
        this.$root.patch(
          'datasources/' + t.activeId,
          t.dsDetails,
          function (res) {
            t.$set(t.datasources, res.id, res)
            t.manualDsChoose = res.id
            t.editLoading = false
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
      },
      expandtable(id) {
        if (id === this.expanded) {
          this.expanded = ""
        } else {
          this.expanded = id
        }
      }
    },
    mounted() {
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
<style lang="less" >

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


</style>
