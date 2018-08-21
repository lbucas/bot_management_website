<template>
  <div>
    <master-detail :tableheading="l.databases" route="databases">
      <b-tabs id="dsDetails">
        <b-tab class="tabTitle" :title="$root.l.general" active>
          <scrollable pos="threeTab">
            <custom-form id="dsform" route="databases">
              <fr-input :label="$root.l.title" model-key="name"/>
              <fr-select model-key="databaseTypeId"
                         :list="databasetypes" :label="l.dbType"/>
              <fr-input :label="l.host" model-key="connectionObj.host" big/>
              <fr-input :label="l.port" model-key="connectionObj.port"/>
              <fr-input :label="l.dbName" model-key="connectionObj.db"/>
              <fr-input :label="l.user" model-key="connectionObj.user"/>
              <fr-input :label="l.password" model-key="connectionObj.password"
                        inputtype="password"/>
            </custom-form>
          </scrollable>
          <edit route="databases"/>
          <save :on-save="createOrEditDs" id="saveDS" v-if="onEdit" route="databases"/>
          <b-button variant="info" @click="testConnection" v-if="!connectionTested">
            {{connectionTestLabel}}
          </b-button>
          <b-button variant="success" v-if="connectionTested" @click="connectionTested=false">{{l.success}}
          </b-button>
          <delete :on-delete="deleteDS" v-if="!onEdit"/>
          <cancel route="databases"/>
        </b-tab>
        <b-tab class="tabTitle" :title="l.tables" v-if="!onEdit">
          <scrollable pos="twoTab">
            <tables :database="dsDetails.id"/>
          </scrollable>
        </b-tab>
      </b-tabs>
    </master-detail>
    <b-modal id="connectionTestModal" title="Connection Failed!">
      {{l.conFailed}}
      {{l.errMsg}} <br><br>
      <p><em>{{connectionErr}}</em></p>
    </b-modal>
  </div>
</template>

<script>
  import StoreItems from '../../components/mixins/StoreItems'
  import Tables from "../../components/Tables"
  import Scrollable from "../../components/Scrollable"

  export default {
    name: 'Databases',
    components: {
      Scrollable,
      Tables
    },
    mixins: [StoreItems],
    data() {
      return {
        connectionTested: false,
        connectionErr: '',
        connectionTestLabel: this.$store.state.lang.datasources.testLabel
      }
    },
    computed: {
      l() {
        return this.$store.state.lang.datasources
      },
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
        this.connectionTestLabel = this.l.testing
        let details = this.dsDetails.connectionObj
        details.databaseTypeId = this.dsDetails.databaseTypeId
        try {
          let res = await this.$store.dispatch('post', {route: 'databases/testconnection', toPost: details})
          this.connectionTestLabel = this.l.testLabel
          this.connectionTested = true
          this.editLoading = false
        } catch (err) {
          this.connectionErr = err.responseJSON.error.message
          this.$roothis.modalOpen('connectionTestModal')
          this.connectionTestLabel = this.l.testLabel
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
  @import "../../style/mixins";

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
