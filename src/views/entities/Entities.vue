<template>
  <div>
    <master-detail :tableheading="l.entities" route="entities">
      <b-tabs>
        <b-tab class="tabTitle" :title="$root.l.general" active>
          <scrollable pos="threeTab">
            <custom-form id="entityForm" route="entities">
              <fr-input model-key="name" :label="$root.l.title" :editable="!(entityDetail.id)"/>
              <fr-input model-key="description" :label="l.desc" big/>
              <fr-attribute-select model-key="attributeId" :label="l.connectedAttr"/>
            </custom-form>
          </scrollable>
          <edit route="entities"/>
          <delete :on-delete="deleteEntity" v-if="!onEdit" />
          <save :on-save="saveEntity" id="saveEntity" v-if="onEdit" route="entities"/>
          <!--@mouseover="test"-->
          <cancel route="entities" v-if="onEdit"/>
        </b-tab>
        <b-tab class="tabTitle" :title="l.keywords" v-if="!onEdit">
          <scrollable pos="twoTab">
            <keywords/>
          </scrollable>
        </b-tab>
      </b-tabs>
    </master-detail>
  </div>

</template>

<script>
  // import Keywords from "./Keywords" use this for rename and summarize functionality
  import Keywords from "./KeywordsLight"
  import StoreItems from '../../components/mixins/StoreItems'

  export default {
    mixins: [StoreItems],
    components: {Keywords},
    name: "entities",
    computed: {
      l() {
        return this.$store.state.lang.entities
      },
      loadingEntities() {
        return this.$store.state.loaders.entities
      },
      entityDetail() {
        return this.$store.state.detailItem.entities
      },
      onEdit() {
        return this.$store.state.onEdit.entities
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
