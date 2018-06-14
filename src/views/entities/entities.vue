<template>
  <div>
    <MasterDetail tableheading="Available Entities" route="entities">
      <b-tabs id="dsDetails">
        <b-tab class="tabTitle" title="General" active>
          <CustomForm id="entityForm">
            <FormRow v-model="entityDetail.name" label="Title" :on-edit="onEdit" :editable="!(entityDetail.id)"/>
            <FormRow v-model="entityDetail.description" label="Description" :on-edit="onEdit" big/>
            <FormRowBlank label="Connected Attribute">
              <input v-if="!onEdit" type="text" readonly class="form-control-plaintext"
                     v-model="currentAttributeFullName">
              <b-row v-if="onEdit">
                <b-col md="12" lg="4">
                  <select class="form-control" v-model="datasourceId" @change="noAttrSelected = true">
                    <option v-for="(ds, id) in datasources" v-bind:value="id">{{ds.name}}</option>
                  </select>
                </b-col>
                <b-col md="12" lg="4">
                  <select class="form-control" v-model="tableId" @change="noAttrSelected = true">
                    <option v-for="(t, id) in tables" v-bind:value="id">{{t.name}}</option>
                  </select>
                </b-col>
                <b-col md="12" lg="4">
                  <select class="form-control" v-model="entityDetail.attributeId" @change="noAttrSelected = false">
                    <option v-for="(a, id) in attributes" v-bind:value="id">{{a.name}}</option>
                  </select>
                </b-col>
              </b-row>
            </FormRowBlank>
          </CustomForm>
          <b-button variant="primary" @click="$store.commit('editing', 'entities')" v-if="!onEdit">Edit</b-button>
          <DeleteButton :on-delete="deleteEntity" v-if="!onEdit"/>
          <b-button variant="primary" id="saveEntity" @click="saveEntity" :disabled="noAttrSelected"
                    v-if="onEdit">Save
          </b-button>
          <b-button variant="sencondary" @click="$store.dispatch('setBackEditing', 'entities')" v-if="onEdit">Cancel</b-button>
        </b-tab>
        <b-tab class="tabTitle" title="Keywords" v-if="!onEdit">
            <keywords/>
        </b-tab>
      </b-tabs>
    </MasterDetail>
  </div>

</template>

<script>
  import MasterDetail from '../../components/MasterDetail.vue'
  import FormRow from '../../components/form/FormRowInput'
  import Loader from '../../components/Loader'
  import FormRowBlank from "../../components/form/FormRowBlank"
  import DeleteButton from "../../components/buttons/DeleteButton"
  import CustomForm from "../../components/form/CustomForm"
  import Keywords from "./keywords"

  export default {
    components: {
      Keywords,
      CustomForm,
      DeleteButton,
      FormRowBlank,
      Loader,
      FormRow,
      MasterDetail
    },
    name: "entities",
    data() {
      return {
        datasourceId: '',
        dsname: '',
        tableId: '',
        tablename: '',
        attributeName: '',
        noAttrSelected: false,
        manualEntityChoose: ''
      }
    },
    computed: {
      entities() {
        return this.$store.state.entities
      },
      datasources() {
        return this.$store.state.datasources
      },
      onEdit() {
        return this.$store.state.onEdit.entities
      },
      tables() {
        var datasourceId = this.datasourceId
        var ds = this.datasources[datasourceId]
        if (ds === undefined) {
          return []
        } else {
          return ds.tables
        }
      },
      attributes() {
        var tid = this.tableId
        var t = this.tables[tid]
        if (t === undefined) {
          return []
        } else {
          return this.$root.arrayToObject(t.attributes)
        }
      },
      entityDetail() {
        return this.$store.state.detailItem.entities
      },
      loadingEntities() {
        return this.$store.state.loaders.entities
      },
      currentAttributeFullName() {
        return this.dsname + ' - ' + this.tablename + ' - ' + this.attributeName
      },
      entityAttrId() {
        return this.entityDetail.attributeId
      }
    },
    created() {
      this.getEntities()
      this.getDatasources()
    },
    methods: {
      getEntities() {
        this.$store.dispatch('load', 'entities')
      },
      getDatasources() {
        this.$store.dispatch('load', 'datasources')
      },
      saveEntity() {
        var t = this
        if (t.entityDetail.id === '' || t.entityDetail.id === undefined) {
          t.$store.dispatch('create', {route: 'entities', toCreate: t.entityDetail})
        } else {
          t.$store.dispatch('patch', {route: 'entities', toPatch: t.entityDetail})
        }
      },
      cancelEdit() {
        this.onEdit = false
        this.manualEntityChoose = this.entityDetail.id
      },
      deleteEntity() {
        this.$store.dispatch('delete', {route: 'entities', toDelete: this.entityDetail.id})
      }
    },
    watch: {
      entityAttrId(id) {
        let ds, table, attr
        for (let datasourceId in this.datasources) {
          ds = this.datasources[datasourceId]
          for (let tabid in ds.tables) {
            table = ds.tables[tabid]
            for (let aid in table.attributes) {
              attr = table.attributes[aid]
              if (attr.id === id) {
                this.datasourceId = ds.id
                this.dsname = ds.name
                this.tableId = table.id
                this.tablename = table.name
                this.attributeName = attr.name
                return
              }
            }
          }
        }
        this.datasourceId = ''
        this.tableId = ''
        this.dsname = ''
        this.tablename = ''
        this.attributeName = ''
      }
    }
  }
</script>

<style lang="less" scoped>
  #entityForm {
    margin-top: 1em;
    select {
      margin-bottom: .5em;
    }
  }

</style>
