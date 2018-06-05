<template>
  <div>
    <MasterDetail tableheading="Entities" :tablecontent="entities" :selected="chooseEntity" :loading="loadingEntities"
                  :addnew="createEntity" :update="getEntities" :manualchoose="manualEntityChoose">
      <b-tabs id="dsDetails">
        <b-tab class="tabTitle" title="General" active>
          <form id="entityForm">
            <FormRow v-model="entityDetail.name" label="Title" :on-edit="onEdit"/>
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
          </form>
          <b-button variant="primary" @click="(onEdit=true)" v-if="!onEdit">Edit</b-button>
          <DeleteButton :on-delete="deleteEntity" v-if="!onEdit"/>
          <b-button variant="primary" id="saveEntity" @click="saveEntity" :disabled="noAttrSelected"
                    v-if="onEdit">Save
          </b-button>
          <b-button variant="sencondary" @click="cancelEdit" v-if="onEdit">Cancel</b-button>
        </b-tab>
      </b-tabs>
    </MasterDetail>
  </div>

</template>

<script>
  import MasterDetail from '../components/MasterDetail.vue'
  import FormRow from '../components/FormRowInput'
  import Loader from '../components/Loader'
  import FormRowBlank from "../components/FormRowBlank"
  import DeleteButton from "../components/DeleteButton"

  export default {
    components: {
      DeleteButton,
      FormRowBlank,
      Loader,
      FormRow,
      MasterDetail
    },
    name: "entities",
    data() {
      return {
        entities: {},
        datasources: {},
        loadingEntities: true,
        entityDetail: {
          id: '',
          name: '',
          description: '',
          attributeId: '',
          onEdit: false
        },
        onEdit: false,
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
      tables() {
        var datasourceId = this.datasourceId
        var ds = this.datasources[datasourceId]
        if (ds === undefined) {
          return []
        } else {
          return this.$root.arrayToObject(ds.tables)
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
      currentAttributeFullName() {
        return this.dsname + ' - ' + this.tablename + ' - ' + this.attributeName
      }
    },
    created() {
      this.getEntities()
      this.getDatasources()
    },
    methods: {
      getEntities(chooseEntity) {
        var t = this
        this.$root.getAndSet(
          'projects/--projectid--/entities',
          t.entities,
          null,
          function (d) {
            t.loadingEntities = false
            t.onEdit = false
            if (chooseEntity !== undefined) {
              t.manualEntityChoose = chooseEntity
            }
          }
        )
      },
      getDatasources() {
        var t = this
        this.$root.getAndSet(
          'projects/--projectid--/dataSources',
          t.datasources,
          null,
          null,
          {filter: {include: {tables: "attributes"}}}
        )
      },
      chooseEntity(e) {
        var t = this
        this.$root.clone(this.entityDetail, e)
        let aid = this.entityDetail.attributeId
        let ds
        let table
        let attr
        for (let datasourceId in this.datasources) {
          ds = this.datasources[datasourceId]
          for (let tabind = 0; tabind < ds.tables.length; tabind++) {
            table = ds.tables[tabind]
            for (let aind = 0; aind < table.attributes.length; aind++) {
              attr = table.attributes[aind]
              if (attr.id === this.entityDetail.attributeId) {
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
      },
      saveEntity() {
        var t = this
        t.loadingEntities = true
        var editEnities = function (d) {
          t.getEntities(d.id)
        }
        if (t.entityDetail.id === '' || t.entityDetail.id === undefined) {
          t.$root.post(
            'entities',
            t.entityDetail,
            function (d) {
              editEnities(d)
            }
          )
        } else {
          t.$root.patch(
            'entities/' + t.entityDetail.id,
            t.entityDetail,
            function (d) {
              editEnities(d)
            }
          )
        }
      },
      createEntity() {
        this.onEdit = true
        var t = this
        let newEntity = {
          name: '',
          description: '',
          attributeId: '',
          projectId: t.$root.project.id
        }
        this.$root.clone(this.entityDetail, newEntity)
      },
      cancelEdit() {
        this.onEdit = false
        this.manualEntityChoose = this.entityDetail.id
      },
      deleteEntity() {
        var t = this
        t.loadingEntities = true
        this.$root.delete(
          'entities',
          t.entityDetail.id,
          function () {
            t.getEntities('')
          }
        )
      }
    },
    watch: {
      datasourceId() {
        this.dsname = this.datasources[this.datasourceId].name
      },
      tableId(tid) {
        this.tablename = this.tables[tid].name
      },
      attrId(attrId) {
        this.attributeName = this.attributes[attrId].name
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
