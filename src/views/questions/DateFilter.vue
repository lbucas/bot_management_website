<template>
  <fr-blank :label="l.dateFilter">
    <div v-if="onEdit && addStart">
      <b-row>
        <b-col cols="12" class="aheading">
          {{startHeading}}
        </b-col>
        <b-col>
          <attribute-select v-model="start"/>
        </b-col>
        <b-col md="1">
          <a @click="removeStart" class="remove">×</a>
        </b-col>
      </b-row>
      <b-row v-if="addEnd">
        <b-col cols="12" class="aheading">
          {{l.attrForEnd}}
        </b-col>
        <b-col>
          <attribute-select v-model="end"/>
        </b-col>
        <b-col md="1">
          <a @click="removeEnd" class="remove">×</a>
        </b-col>
      </b-row>
      <b-button id="addEnd" @click="addEnd= true" v-if="!addEnd && addStart" size="sm" variant="outline-primary">
        {{l.addEndDate}}
      </b-button>
    </div>
    <div v-else-if="onEdit">
      <b-button id="addStart" @click="addStart= true" size="sm" variant="outline-primary">
        {{l.addDateFilter}}
      </b-button>
    </div>
    <input type="text" v-else readonly class="form-control-plaintext" v-model="displayValue"/>
  </fr-blank>
</template>

<script>
  import AttributeSelect from "../../components/form/AttributeCompleteSelect"

  export default {
    name: "DateFilter",
    components: {AttributeSelect},
    data() {
      return {
        addStart: false,
        addEnd: false
      }
    },
    computed: {
      l() {
        return this.$store.state.lang.intents
      },
      start: {
        get() {
          return this.$store.state.detailItem.intents.dateRangeStartId
        },
        set(value) {
          this.$store.commit('updateDetailItem', {route: 'intents', key: 'dateRangeStartId', value})
          if (!this.addEnd) {
            this.$store.commit('updateDetailItem', {route: 'intents', key: 'dateRangeEndId', value})
          }
        }
      },
      end: {
        get() {
          return this.$store.state.detailItem.intents.dateRangeEndId
        },
        set(value) {
          this.$store.commit('updateDetailItem', {route: 'intents', key: 'dateRangeEndId', value})
        }
      },
      startHeading() {
        return this.addEnd ? this.l.attrForStart : this.l.attrForDate
      },
      onEdit() {
        return this.$store.state.onEdit.intents
      },
      displayValue() {
        let afn = (id) => (this.$tools.attributeFullName(id))
        return this.start !== this.end
          ? `${this.l.start} ${afn(this.start)}  ${this.l.end} ${afn(this.end)} `
          : afn(this.start)
      }
    },
    methods: {
      removeStart() {
        this.addStart = false
        this.start = null
        this.end = null
      },
      removeEnd() {
        this.addEnd = false
        this.end = this.start
      }
    },
    watch: {
      onEdit(oe) {
        if (oe) {
          if (this.start) {
            this.addStart = true
            if (this.end !== this.start) this.addEnd = true
          } else {
            this.addStart = false
            this.addEnd = false
          }
        }
      }
    }
  }
</script>

<style scoped>
  .aheading {
    margin: .5rem 0 .5rem;
  }

  #addEnd {
    margin-top: .5rem;
  }

  .remove {
    cursor: pointer;
  }

</style>
