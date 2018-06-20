<template>
  <b-row>
    <Loader :loading="loading"/>
    <b-col lg="4">
      <Pagination subroute="trainings" :id="intentId"/>
      <Table :head="['Trained Sentences:']">
        <tr v-if="trainingsCount == 0">
          <td>No trainings added yet.</td>
        </tr>
        <tr v-for="(t, id) in trainingsOnPage"
            @click="$store.commit()">
          <td>
            {{t.sentence}}
          </td>
        </tr>
      </Table>
    </b-col>
    <b-col lg="8">
      <center-button v-if="!inputVisible">
        <b-button variant="primary" id="addNewSentence" @click="addTraining">Add new sentence</b-button>
      </center-button>
      <div v-else>
        <label for="testing">Training sentence:</label>
        <!--<label for="trainingSentence">Training sentence:</label>
        <textarea v-model="trainingDetail.sentence" id="trainingSentence" class="form-control"
                  @select="sentenceSelected"/>-->
        <div id="testing" contenteditable="true" @mouseup="sentenceSelected">This is an editable paragraph.</div>
        <save-button id="saveTraining" :on-save="saveTraining"/>
        <!-- <Table :head="['Text', 'Linked entity']">
          <tr v-for="part in selectedParts">
            <td>{{part.text}}</td>
            <td></td>
          </tr>
        </Table> -->
      </div>
    </b-col>
  </b-row>
</template>

<script>
  import Table from "../../components/Table"
  import CenterButton from "../../components/buttons/CenterButton"
  import Loader from "../../components/Loader"
  import Pagination from "../../components/Pagination"
  import SaveButton from "../../components/buttons/SaveButton"

  export default {
    name: "Training",
    components: {SaveButton, Pagination, Loader, CenterButton, Table},
    props: {
      intentId: {}
    },
    data() {
      return {
        inputVisible: false
      }
    },
    computed: {
      trainingsOnPage() {
        return this.$store.state.onPage.trainings[this.intentId] || {}
      },
      trainingsCount() {
        return this.$store.state.loadLimitedCount.trainings[this.intentId] || 0
      },
      trainingDetail() {
        return this.$store.state.detailItem.trainings[this.intentId] || {sentence: '', id: this.intentId}
      },
      loading() {
        return this.$store.state.loaders.intents && this.$store.state.loaders.trainings[this.intentId]
      }
    },
    created() {
      this.loadTrainings()
    },
    methods: {
      sentenceSelected(e) {
        debugger
        /*
        let start = e.currentTarget.selectionStart
        let end = e.currentTarget.selectionEnd
        let newText = this.sentence.substring(start, end)
        let sp = this.selectedParts
        let newKey = Object.keys(sp).length
        let insert = {
          text: newText,
          connected: ''
        }
        this.$set(sp, newKey, insert) */
      },
      loadTrainings() {
        this.$store.dispatch('getRouteSpecific', {subroute: 'trainings', id: this.intentId})
      },
      addTraining() {
        this.inputVisible = true
        this.$store.commit('newTraining', this.intentId)
      },
      saveTraining() {
        this.$store.dispatch('saveTraining', this.intentId)
      }
    },
    watch: {}
  }
</script>

<style lang="less" scoped>
  @import "../../assets/less/mixins";

  #trainingSentence {
    #bootrapInput
  }

  #saveTraining {
    margin-top: 1rem;
  }

  #addNewSentence {
    margin-top: 2rem;
  }

  label {
    font-size: 1rem;
  }

</style>
