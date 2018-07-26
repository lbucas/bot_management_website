<template>
  <div>
    <MasterDetail tableheading="Available Entities" route="entities">
      <b-tabs>
        <b-tab class="tabTitle" title="General" active>
          <custom-form id="entityForm" route="entities" :errors-visible="errorsVisible">
            <form-row-input model-key="name" label="Title" :editable="!(entityDetail.id)"/>
            <form-row-input model-key="description" label="Description" big/>
            <form-row-attribute-select model-key="attributeId" label="Connected Attribute"/>
          </custom-form>
          <edit-button route="entities"/>
          <delete-button :on-delete="deleteEntity" v-if="!onEdit"/>
          <save-button :on-save="saveEntity" id="saveEntity" :disabled="notSaveable" v-if="onEdit"/>
                       <!--@mouseover="test"-->
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
  import FormRowInput from '../../components/form/FormRowInput'
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
      FormRowInput,
      MasterDetail
    },
    name: "entities",
    data() {
      return {
        errorsVisible: false
      }
    },
    computed: {
      loadingEntities() {
        return this.$store.state.loaders.entities
      },
      entityDetail() {
        return this.$store.state.detailItem.entities
      },
      onEdit() {
        return this.$store.state.onEdit.entities
      },
      notSaveable() {
        let ed = this.entityDetail
        return (ed.name === '' || ed.description === '' || !ed.attributeId)
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
        this.entityDetail.id
          ? this.$store.dispatch('patch', {route: 'entities', toPatch: this.entityDetail})
          : this.$store.dispatch('create', {route: 'entities', toCreate: this.entityDetail})
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
