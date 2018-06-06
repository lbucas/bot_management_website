<template>
  <div>
    <input class="suseInput form-control" autocomplete="off"
           :disabled="disabled" v-model="inputValue" @click="suggestionsVisible=true"
           @keyup.up="suggestionKeyChange(false)"
           @keyup.down="suggestionKeyChange(true)" @keyup.enter="select" :placeholder="placeholder"/>
    <div class="suggestions" v-if="suggestionsVisible">
      <ul class="suggestionList">
        <li v-if="(Object.keys(suggestions).length == 0) && inputValue.length > 0" class="noItems">No items to select</li>
        <li v-for="(suggestion, id) in suggestions" :active="activeId == id" @mouseover="changedBySelection=true; activeId=id" @mouseout="activeId=''"
            @click="select">
          {{suggestion[listDisplayValue]}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SuggestionSelect',
    props: {
      value: String,
      list: Object,
      listDisplayValue: {
        type: String,
        default: 'name'
      },
      initiallyOpen: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      change: {
        type: Function,
        default: function () {
        }
      },
      placeholder: {
        type: String,
        default: ''
      },
      clearAfterSelect: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        inputValue: '',
        suggestionsVisible: false,
        activeId: '',
        changedBySelection: false,
        suggestions: this.$props.list,
        valueSelected: false
      }
    },
    computed: {
      suggestionIndex() {
        let si = {}
        let sug = this.suggestions
        let c = 0
        for (let key in sug) {
          si[c] = key
          c++
        }
        return si
      },
      suggestionReverseIndex() {
        let si = {}
        let sug = this.suggestions
        let c = 0
        for (let key in sug) {
          si[key] = c
          c++
        }
        return si
      }
    },
    created() {
      this.setInputValue(this.$props.value)
      if (this.$props.initiallyOpen) {
        this.suggestionsVisible = true
      }
    },
    methods: {
      setInputValue(v) {
        try {
          let n = this.$props.list[v][this.$props.listDisplayValue]
          this.inputValue = n
        } catch (e) {
          this.inputValue = ''
        }
      },
      suggestionKeyChange(isDown) {
        if (this.suggestionsVisible) {
          this.changedBySelection = true
          let toAdd = (isDown ? 1 : -1)
          try {
            let index = this.suggestionReverseIndex[this.activeId]
            if (index === undefined) {
              index = -1
            }
            let newActive = this.suggestionIndex[index + toAdd]
            this.activeId = newActive
          } catch (e) {
          }
        } else {
          this.suggestionsVisible = true
        }
      },
      searchList() {
        var val = this.inputValue.toLowerCase()
        var list = this.list
        if (!val) {
          this.suggestions = list
        }
        var s = {}
        var dval = this.listDisplayValue
        for (let lkey in list) {
          if (list[lkey][dval].toLowerCase().indexOf(val) !== -1) {
            s[lkey] = list[lkey]
          }
        }
        this.suggestions = s
      },
      select() {
        this.$emit("input", this.activeId)
        this.suggestionsVisible = false
        this.valueSelected = true
        if (this.$props.clearAfterSelect) {
          this.inputValue = ''
        }
        this.$props.change()
      }
    },
    watch: {
      value(v) {
        this.setInputValue(v)
      },
      inputValue(newI, oldI) {
        if (!this.changedBySelection) {
          this.activeId = ''
          this.searchList()
        }
        this.changedBySelection = false
        if (newI.length === 0 && oldI.length > 0) {
          this.suggestionsVisible = false
        }
      },
      activeId(id) {
        this.setInputValue(id)
      },
      list(l) {
        this.suggestions = l
        this.searchList()
      }
    }

  }
</script>

<style lang="less" scoped>
  .suggestions {
    Border-Width: 0 1px 1px 1px;
    border-color: #e6e6e6;
    border-style: solid;
    position: absolute;
    background: white;
    width: 93%;
    z-index: 2;
    max-height: 30vh;
    overflow-y: auto;
    .suggestionList {
      padding-left: 0;
      list-style-type: none;
      margin-bottom: 0;
      .noItems {
        font-style: italic;
      }
      li {
        cursor: pointer;
        padding-left: .5em;
        &[active] {
          background: #e6f0ff;
        }
      }
    }
  }
</style>
