<template>
  <div>
    <b-row>
      <b-col lg="4" id="dsTable">
        <h5>Available Datasources:</h5>
        <div class="table-responsive">
          <table class="table table-hover">
            <tbody>
            <tr v-for="d in datasources" @click="chooseDs(d)">
              <td>
                <span class="dbname float-left">{{d.name}}</span>
                <span class="dbtype float-right">{{d.type}}</span>
              </td>
            </tr>
            </tbody>
          </table>
          <b-button variant="primary" @click="addDs">Add new</b-button>
        </div>
      </b-col>
      <b-col lg="8">
        <b-tabs v-if="dsSelected" id="dsDetails">
          <b-tab title="General" active>
            <form>
              <div class="form-group row">
                <label  class="col-sm-2 col-form-label">Name</label>
                <div class="col-sm-10">
                  <input type="text"  v-bind:readonly="!onEdit" v-bind:class="{ 'form-control-plaintext': !onEdit, 'form-control': onEdit }" v-model="dsDetails.name">
                </div>
              </div>
              <div class="form-group row">
                <label  class="col-sm-2 col-form-label">Type</label>
                <div class="col-sm-10">
                  <input v-if="!onEdit" type="text"  readonly class="form-control-plaintext" v-model="dsDetails.type">
                  <select class="form-control" v-if="onEdit" v-model="dsDetails.type" >
                    <option v-for="type in databasetypes">{{type}}</option>
                  </select>
                </div>
              </div>
              <div class="form-group row">
                <label  class="col-sm-2 col-form-label">URL</label>
                <div class="col-sm-10">
                  <input type="text" v-bind:readonly="!onEdit" v-bind:class="{ 'form-control-plaintext': !onEdit, 'form-control': onEdit }" v-model="dsDetails.credentials.url">
                </div>
              </div>
              <div class="form-group row">
                <label  class="col-sm-2 col-form-label">Port</label>
                <div class="col-sm-10">
                  <input type="text" v-bind:readonly="!onEdit" v-bind:class="{ 'form-control-plaintext': !onEdit, 'form-control': onEdit }" v-model="dsDetails.credentials.port">
                </div>
              </div>
              <div class="form-group row">
                <label  class="col-sm-2 col-form-label">User</label>
                <div class="col-sm-10">
                  <input type="text" v-bind:readonly="!onEdit" v-bind:class="{ 'form-control-plaintext': !onEdit, 'form-control': onEdit }" v-model="dsDetails.credentials.user">
                </div>
              </div>
              <div class="form-group row">
                <label class="col-sm-2 col-form-label">Password</label>
                <div class="col-sm-10">
                  <input type="password" v-bind:readonly="!onEdit" v-bind:class="{ 'form-control-plaintext': !onEdit, 'form-control': onEdit }"  v-model="dsDetails.credentials.password">
                </div>
              </div>
            </form>
            <b-button variant="secondary" @click="(onEdit=true)">Edit</b-button>
          </b-tab>
          <b-tab title="Tables">
            <br>I'm the second tab content
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  export default {
    name: 'datasources',
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
        ]
      }
    },
    methods: {
      chooseDs(ds) {
        this.dsDetails = ds
        this.dsSelected = true
      },
      addDs() {
        this.onEdit = true
        this.dsSelected = true
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  #dsTable {
    .dbname {
      font-weight: 400;
    }
    .dbtype {
      font-weight: 100;
      font-size: .7em;
    }
    td {
      cursor: pointer;
    }
  }

  #dsDetails {
    input {
      width: 100%
    }
  }

  .nav-tabs {
    a {
      color: black !important;
    }
  }



</style>
