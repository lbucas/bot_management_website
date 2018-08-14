<template>
  <b-row id="trainings">
    <loader :loading="loading"/>
    <b-col lg="12" id="newSentence">
      <center-button v-if="!trainingDetail">
        <b-button variant="primary" id="addNewSentence" @click="addTraining">{{l.addSentence}}</b-button>
      </center-button>
      <div v-else>
        <label for="trainingSentence">{{l.trainingSenctence}}</label>
        <textarea class="form-control" id="trainingSentence" type="text" v-model="trainingDetail.sentence"
                  @select="sentenceSelected"/>
        <p id="markHint"><i>{{l.markHint}}</i></p>
        <Table :head="[l.value, l.entity, '']" v-show="trainingDetail._annotations.length > 0">
          <tr v-for="(a, ind) in trainingDetail._annotations">
            <td>{{a.value}}</td>
            <td>
              <span class="connectedEntity" v-if="a.entityId != null" @click="a.entityId = null">
                {{entities[a.entityId].name}}
              </span>
              <select v-if="a.entityId == null" class="form-control" v-model="a.entityId">
                <option v-for="e in usableEntities" :value="e">{{entities[e].name}}</option>
              </select>
            </td>
            <td class="removeAnnotation">
              <b-button variant="outline-secondary" size="sm" @click="trainingDetail._annotations.splice(ind, 1)">×
              </b-button>
            </td>
          </tr>
        </Table>
        <save id="saveTraining" class="trainingButton" :on-save="saveTraining"
                     :text="(trainingDetail.id ? $root.l.update:$root.l.add)" :disabled="notSaveable"/>
        <b-button variant="secondary" class="trainingButton" @click="addTraining">{{$root.l.clear}}</b-button>
        <delete v-show="trainingDetail.id" :on-delete="deleteTraining"/>

      </div>
    </b-col>
    <b-col lg="12">
      <Pagination subroute="trainings" :id="intentId"/>
      <Table :head="tableheader" id="trainingsAvailable">
        <tr v-if="trainingsCount == 0">
          <td>{{l.noTrainings}}</td>
        </tr>
        <tr v-for="(t, id) in trainingsOnPage" :active="activeId == t.id"
            @click="$store.commit('trainingSelected', {intentId: intentId, training: t})">
          <td>
            {{t.sentence}}
          </td>
        </tr>
      </Table>
    </b-col>
  </b-row>
</template>

<script>
  import Table from "../../components/Table"
  import CenterButton from "../../components/buttons/CenterButton"
  import Pagination from "../../components/Pagination"

  export default {
    name: "Training",
    components: {Pagination, CenterButton, Table},
    props: {
      intentId: {}
    },
    data() {
      return {
        inputVisible: true,
        last: ''
      }
    },
    computed: {
      l() {
        return this.$store.state.lang.intents
      },
      trainingsOnPage() {
        return this.$store.state.onPage.trainings[this.intentId] || {}
      },
      trainingsCount() {
        return this.$store.state.loadLimitedCount.trainings[this.intentId] || 0
      },
      trainingDetail() {
        return this.$store.state.detailItem.trainings[this.intentId]
      },
      loading() {
        return this.$store.state.loaders.intents || this.$store.state.loaders.trainings[this.intentId]
      },
      tableheader() {
        let count = this.$store.state.loadLimitedCount.trainings[this.intentId] || 0
        return [`${this.l.trainedSentences} (${count})`]
      },
      entities() {
        return this.$store.state.entities
      },
      usableEntities() {
        let usable = []
        let det = this.$store.state.detailItem.intents
        for (let i = 0; i < det.filterByIds.length; i++) usable.push(det.filterByIds[i])
        return usable
      },
      activeId() {
        return this.trainingDetail ? this.trainingDetail.id : null
      },
      notSaveable() {
        let det = this.trainingDetail
        if (det.sentence === '') return true
        for (let ind in det._annotations) {
          let a = det._annotations[ind]
          if (a.entityId === null) return true
        }
        return false
      }
    },
    created() {
      this.loadTrainings()
    },
    methods: {
      async sentenceSelected(e) {
        let s = this.trainingDetail.sentence
        let start = e.currentTarget.selectionStart
        let end = e.currentTarget.selectionEnd
        if (s.substring(start, start + 1) === ' ') start++
        if (s.substring(end - 1, end) === ' ') end--
        let value = s.substring(start, end)
        if (value !== this.last && value !== s) {
          this.last = value
          for (let i = this.trainingDetail._annotations.length - 1; i >= 0; i--) {
            let a = this.trainingDetail._annotations[i]
            if ((a.start >= start && a.start <= end) || (a.end >= start && a.end <= end) || !a.entityId) {
              this.trainingDetail._annotations.splice(i, 1)
            }
          }
          let whereFilter = {
            filter: {
              where: {
                value: value,
                projectId: this.$store.state.projectId,
                entityId: {
                  inq: this.usableEntities
                }
              }
            }
          }
          let eid = null
          let d = await this.$store.dispatch('get', {route: 'keywords', filter: whereFilter})
          if (d[0]) eid = d[0].entityId
          this.trainingDetail._annotations.push({
            start: start,
            end: end,
            value: value,
            entityId: eid
          })
        }
      },
      loadTrainings() {
        (this.intentId) && (this.$store.dispatch('getRouteSpecific', {subroute: 'trainings', id: this.intentId}))
      },
      addTraining() {
        this.$store.commit('newTraining', this.intentId)
      },
      saveTraining() {
        this.trainingDetail.id
          ? this.$store.dispatch('saveTraining', {intentId: this.intentId, patch: true})
          : this.$store.dispatch('saveTraining', {intentId: this.intentId, patch: false})
      }
    },
    deleteTraining() {
      this.$store.dispatch('deleteTraining', this.intentId)
      this.addTraining()
    }
  }
</script>

<style scoped lang="less">
  @import "../../style/mixins";
  @import "../../style/colors";

  #trainings {
    #trainingSentence {
    }

    #newSentence {
      margin-top: 1rem;
    }

    #addNewSentence {
      margin-top: 1rem;
    }

    label {
      font-size: 1rem;
    }

    .connectedEntity {
      cursor: pointer;
    }

    #trainingsAvailable tr {
      #tableSelectable
    }

    .removeAnnotation {
      max-width: 1rem;
    }

    #markHint {
      padding: .5rem 0 1rem .5rem;
    }

  }


</style>
