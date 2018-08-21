<template>
  <fr-blank :label="l.fixedFilter">
    <div v-for="filter in filters">
      <div v-if="currentActive == filter.attributeId && onEdit">
        <attribute-select v-model="changeAttribute" :valid="!validation"/>
        <badges :values="currentValues" :remove="removeFromFilters"/>
        <suggestion-select v-if="currentActive != -1" v-model="addNext" :apilookup="apilookup"
                           :placeholder="l.enterFilterVal" class="filterInput"
                           clear-after-select add-button :valid="!validation"/>
      </div>
      <div v-else class="filterList">
        <div class="editFixedFilter" @click="edit(filter.attributeId)" v-if="onEdit">
          <icon icon="edit"/>
        </div>
        <span class="attributeName">{{$tools.attributeFullName(filter.attributeId)}}:</span> {{filter.filters |
        filtersFlat}}
      </div>
    </div>
    <div id="filterButtons" v-if="onEdit">
      <b-button v-if="newFilterPossible" variant="outline-primary" size="sm" @click="addNewFilter">{{l.addFFilter}}
      </b-button>
      <b-button v-if="currentActive" variant="outline-danger" size="sm" @click="removeAttrFromFilters()">
        {{$root.l.remove}}
      </b-button>
    </div>
    <div class="validationMessage" v-if="validation">
      {{validation}}
    </div>
  </fr-blank>
</template>

<script>
  import SuggestionSelect from "../../components/form/SuggestionSelect"
  import AttributeSelect from "../../components/form/AttributeCompleteSelect"
  import Icon from "../../components/Icon"
  import Badges from "../../components/Badges"

  export default {
    name: "FixedFilters",
    components: {Badges, Icon, AttributeSelect, SuggestionSelect},
    data() {
      return {
        currentActive: null
      }
    },
    computed: {
      l() {
        return this.$store.state.lang.intents
      },
      filters: {
        get() {
          let f = this.$store.state.detailItem.intents.fixedFilter
          if (!Array.isArray(f)) {
            let arr = []
            for (let attributeId in f) arr.push({attributeId, filters: f[attributeId]})
            f = arr
          }
          return f
        },
        set(value) {
          this.$store.commit('updateDetailItem', {route: 'intents', key: 'fixedFilter', value})
        }
      },
      apilookup() {
        return `attributes/${this.currentActive}/searchValues`
      },
      currentValues: {
        get() {
          return this.filters[this.currentActiveIndex].filters || []
        },
        set(v) {
          let f = []
          this.$tools.clone(f, this.filters)
          if (v.length === 0) {
            f.splice(this.currentActiveIndex, 1)
          } else {
            f[this.currentActiveIndex].filters = v
          }
          this.filters = f
        }
      },
      addNext: {
        get() {
          return null
        },
        set(v) {
          this.currentValues = this.currentValues.concat([v])
        }
      },
      changeAttribute: {
        get() {
          return this.currentActive
        },
        set(v) {
          if (v) {
            for (let i = 0; i < this.filters.length; i++) {
              let f = this.filters[i]
              if (f.attributeId == this.currentActive) { // eslint-disable-line eqeqeq
                f.attributeId = v
                break
              }
            }
            this.currentActive = v
            this.filters = this.filters // To trigger the set function
          }
        }
      },
      onEdit() {
        return this.$store.state.onEdit.intents
      },
      attributes() {
        return this.$store.getters.attributes
      },
      newFilterPossible() {
        let l = this.filters.length
        return l === 0 || this.filters[l - 1].filters.length > 0
      },
      currentActiveIndex() {
        return this.$tools.arrayIndexOf(this.filters, 'attributeId', this.currentActive)
      },
      validation() {
        return this.$store.state.validationsVisible.intents
          ? this.$store.getters.validationErrors.intents.fixedFilter
          : false
      }
    },
    methods: {
      addNewFilter() {
        this.filters = this.filters.concat([{attributeId: -1, filters: []}])
        this.currentActive = -1
      },
      removeFromFilters(ind) {
        let f = this.currentValues
        f.splice(ind, 1)
        this.currentValues = f
      },
      edit(id) {
        if (this.currentActiveIndex != -1 && this.filters[this.currentActiveIndex].filters.length === 0) {
          this.removeAttrFromFilters(this.currentActiveIndex)
        }
        this.currentActive = id
      },
      removeAttrFromFilters() {
        this.currentValues = []
        this.currentActive = null
      }
    },
    filters: {
      filtersFlat(filters) {
        let first = true
        let flat = ''
        for (let filter of filters) {
          if (first) {
            flat += filter
            first = false
          } else {
            flat += ', ' + filter
          }
        }
        return flat
      }
    }
  }
</script>

<style lang="less" scoped>

  .editFixedFilter {
    display: inline-block;
    cursor: pointer;
  }

  #filterButtons {
    margin-top: 1rem;
  }

  .filterList {
    margin: 1rem 0 1rem;
    .attributeName {
      font-weight: bold;
    }
  }
</style>
