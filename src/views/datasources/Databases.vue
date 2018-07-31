<template>
  <div>
    <master-detail tableheading="Available Databases" route="databases">
      <b-tabs id="dsDetails">
        <b-tab class="tabTitle" title="General" active>
          <custom-form id="dsform" route="databases">
            <fr-input label="Title" model-key="name"/>
            <fr-select model-key="databaseTypeId"
                             :list="databasetypes" label="Database Type"/>
            <fr-input label="Host" model-key="connectionObj.host" big/>
            <fr-input label="Port" model-key="connectionObj.port"/>
            <fr-input label="DB-Name" model-key="connectionObj.db"/>
            <fr-input label="User" model-key="connectionObj.user"/>
            <fr-input label="Password" model-key="connectionObj.password"
                            inputtype="password"/>
          </custom-form>
          <edit route="databases"/>
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

          <delete :on-delete="deleteDS" v-if="!onEdit"/>
          <cancel route="databases"/>
        </b-tab>
        <b-tab class="tabTitle" title="Tables" v-if="!onEdit">
          <tables :database="dsDetails.id"/>
        </b-tab>
      </b-tabs>
    </master-detail>
    <b-modal id="connectionTestModal" title="Connection Failed!">
      Connection to the database with the given credentials did not succeed.
      Error Message: <br><br>
      <p><em>{{connectionErr}}</em></p>
    </b-modal>
  </div>
</template>

<script>
  import StoreItems from '../../components/mixins/StoreItems'
  import Tables from "../../components/Tables"

  export default {
    name: 'Databases',
    components: {
      Tables
    },
    mixins: [StoreItems],
    data() {
      return {
        connectionTested: false,
        connectionErr: '',
        connectionTestLabel: 'Test Connection'
      }
    },
    computed: {
      loading() {
        return this.$store.state.loaders.databases
      },
      dsDetails() {
        return this.$store.state.detailItem.databases
      },
      onEdit() {
        return this.$store.state.onEdit.databases
      },
      currentDsType() {
        let dsid = this.dsDetails.databaseTypeId
        try {
          return this.databasetypes[dsid]['name']
        } catch (e) {
          return ''
        }
      }
    },
    methods: {
      getDS() {
        this.$store.dispatch('load', 'databases')
      },
      updateDS() {
        this.$store.dispatch('update', 'databases')
      },
      createOrEditDs() {
        this.dsDetails.id ? this.editDs() : this.createDs()
      },
      getDsTypes() {
        this.$store.dispatch('load', 'databasetypes')
      },
      createDs() {
        let newDs = {}
        this.$tools.clone(newDs, this.dsDetails)
        delete newDs.tables
        this.$store.dispatch('create', {route: 'databases', toCreate: newDs})
      },
      editDs() {
        let patched = {}
        this.$tools.clone(patched, this.dsDetails)
        delete patched.tables
        this.$store.dispatch('patch', {route: 'databases', toPatch: patched})
      },
      deleteDS() {
        this.$store.dispatch('delete', {route: 'databases', toDelete: this.dsDetails.id})
      },
      async testConnection() {
        this.connectionTestLabel = 'Testing..'
        let details = this.dsDetails.connectionObj
        details.databaseTypeId = this.dsDetails.databaseTypeId
        try {
          let res = await this.$store.dispatch('post', {route: 'databases/testconnection', toPost: details})
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
