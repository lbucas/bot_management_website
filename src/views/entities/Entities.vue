<template>
  <div>
    <MasterDetail tableheading="Available Entities" route="entities">
      <b-tabs id="dsDetails">
        <b-tab class="tabTitle" title="General" active>
          <custom-form id="entityForm" :on-edit="onEdit">
            <form-row v-model="entityDetail.name" label="Title" :editable="!(entityDetail.id)"/>
            <form-row v-model="entityDetail.description" label="Description"  big/>
            <form-row-attribute-select v-model="entityDetail.attributeId" label="Connected Attribute"/>
          </custom-form>
          <edit-button route="entities"/>
          <delete-button :on-delete="deleteEntity" v-if="!onEdit"/>
          <save-button :on-save="saveEntity" id="saveEntity" :disabled="noAttrSelected" v-if="onEdit"/>
          <cancel-button route="entities" v-if="onEdit"/>
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
  import Keywords from "./Keywords"
  import CancelButton from "../../components/buttons/CancelButton"
  import FormRowAttributeSelect from "../../components/form/FormRowAttributeSelect"
  import StoreItems from '../../components/mixins/StoreItems'
  import SaveButton from "../../components/buttons/SaveButton"
  import EditButton from "../../components/buttons/EditButton"

  export default {
    mixins: [StoreItems],
    components: {
      EditButton,
      SaveButton,
      FormRowAttributeSelect,
      CancelButton,
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
        noAttrSelected: false
      }
    },
    computed: {
      onEdit() {
        return this.$store.state.onEdit.entities
      },
      entityDetail() {
        return this.$store.state.detailItem.entities
      },
      loadingEntities() {
        return this.$store.state.loaders.entities
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
        if (t.entityDetail.id) {
          t.$store.dispatch('patch', {route: 'entities', toPatch: t.entityDetail})
        } else {
          t.$store.dispatch('create', {route: 'entities', toCreate: t.entityDetail})
        }
      },
      deleteEntity() {
        this.$store.dispatch('delete', {route: 'entities', toDelete: this.entityDetail.id})
      }
    }
  }
</script>

<style lang="less" scoped>
  #entityForm {
    margin-top: 1em;
  }

</style>
