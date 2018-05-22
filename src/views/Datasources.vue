<template>
  <div>
    <MasterDetail tableheading="Available Datasources" :addnew="addDs">
      <tbody slot="table">
      <tr v-for="d in datasources" @click="chooseDs(d)" v-bind:active="(d.id == activeId)">
        <td>
          <span class="tablePrimary float-left">{{d.name}}</span>
          <span class="tableSecondary float-right">{{d.type}}</span>
        </td>
      </tr>
      </tbody>

      <b-tabs slot="detail" v-if="dsSelected" id="dsDetails">
        <b-tab class="tabTitle" title="General" active>
          <form id="dsform">
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Name</label>
              <div class="col-sm-10">
                <input type="text" v-bind:readonly="!onEdit"
                       v-bind:class="{ 'form-control-plaintext': !onEdit, 'form-control': onEdit }"
                       v-model="dsDetails.name">
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Type</label>
              <div class="col-sm-10">
                <input v-if="!onEdit" type="text" readonly class="form-control-plaintext" v-model="dsDetails.type">
                <select class="form-control" v-if="onEdit" v-model="dsDetails.type">
                  <option v-for="type in databasetypes">{{type}}</option>
                </select>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">URL</label>
              <div class="col-sm-10">
                <input type="text" v-bind:readonly="!onEdit"
                       v-bind:class="{ 'form-control-plaintext': !onEdit, 'form-control': onEdit }"
                       v-model="dsDetails.credentials.url">
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Port</label>
              <div class="col-sm-10">
                <input type="text" v-bind:readonly="!onEdit"
                       v-bind:class="{ 'form-control-plaintext': !onEdit, 'form-control': onEdit }"
                       v-model="dsDetails.credentials.port">
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">User</label>
              <div class="col-sm-10">
                <input type="text" v-bind:readonly="!onEdit"
                       v-bind:class="{ 'form-control-plaintext': !onEdit, 'form-control': onEdit }"
                       v-model="dsDetails.credentials.user">
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Password</label>
              <div class="col-sm-10">
                <input type="password" v-bind:readonly="!onEdit"
                       v-bind:class="{ 'form-control-plaintext': !onEdit, 'form-control': onEdit }"
                       v-model="dsDetails.credentials.password">
              </div>
            </div>
          </form>
          <b-button variant="primary" @click="(onEdit=true)" v-if="!onEdit">Edit</b-button>
          <b-button variant="primary" @click="saveDs" v-bind:disabled="!connectionTested" v-if="onEdit">Save
          </b-button>
          <b-button variant="info" @click="testConnection">Test Connection</b-button>
          <b-button variant="secondary" v-if="(onEdit&&!dsDetails.id=='')" @click="onEdit=false">Cancel</b-button>
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
  </div>
</template>

<script>
  import MasterDetail from '../components/MasterDetail'

  export default {
    name: 'datasources',
    components: {
      MasterDetail
    },
    data() {
      return {
        datasources: [
          {
            id: '1',
            name: 'Rebate Main',
            type: "Redshift",
            credentials: {
              url: "foo.bar",
              user: "foouser",
              password: "asdf1234",
              port: "27000"
            },
            tables: [
              {
                id: '1',
                name: "table1",
                attributes: [
                  {
                    id: '5',
                    name: "attr1",
                    type: "String",
                    entity: "ent1"
                  },
                  {
                    id: '6',
                    name: "attr2",
                    type: "date",
                    entity: null
                  }
                ]
              },
              {
                id: '10',
                name: "table2",
                attributes: [
                  {
                    id: '3b',
                    name: "attr1",
                    type: "date",
                    entity: "ent1"
                  },
                  {
                    id: '4r',
                    name: "attr2",
                    type: "String",
                    entity: null
                  }
                ]
              }
            ]
          },
          {
            id: '2',
            name: 'Rebate Mapping',
            type: "MySQL",
            credentials: {
              url: "foo.bar",
              user: "foouser",
              password: "asdf1234",
              port: "27000"
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
          }
        ],
        dsSelected: false,
        onEdit: false,
        showTables: true,
        dsDetails: {
          id: '1',
          name: 'Rebate Main',
          type: "Redshift",
          credentials: {
            url: "foo.bar",
            user: "foouser",
            password: "asdf1234",
            port: "27000"
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
        databasetypes: [
          'MySQL', 'Redshift', 'OracleSQL'
        ],
        connectionTested: false,
        activeId: "",
        expanded: ""
      }
    },
    methods: {
      chooseDs(ds) {
        this.dsDetails = ds
        this.dsSelected = true
        this.showTables = true
        this.onEdit = false
        this.activeId = ds.id
      },
      addDs() {
        this.onEdit = true
        this.dsSelected = true
        this.dsDetails = {
          id: '',
          name: '',
          type: "",
          credentials: {
            url: "",
            user: "",
            password: "",
            port: ""
          },
          tables: []
        }
        this.showTables = false
        this.activeId = ""
      },
      saveDs() {
      },
      testConnection() {
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
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

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


</style>
