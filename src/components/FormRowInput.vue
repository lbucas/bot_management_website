<template>
  <FormRowBlank :label="label">
    <input v-if="!big"  :type="inputtype" v-bind:readonly="!onEdit"
           :class="{ 'form-control-plaintext': !onEdit, 'form-control': onEdit }" v-model="inputValue"/>
    <textarea v-if="big" :type="inputtype" v-bind:readonly="!onEdit"
           :class="{ 'form-control-plaintext': !onEdit, 'form-control': onEdit }" v-model="inputValue"/>

  </FormRowBlank>
</template>

<script>
  import FormRowBlank from "./FormRowBlank"

  export default {
    name: "FormRowInput",
    components: {FormRowBlank},
    props: {
      label: String,
      value: String,
      onEdit: Boolean,
      change: {
        type: Function,
        default: function () {
        }
      },
      inputtype: {
        type: String,
        default: 'text'
      },
      big: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        inputValue: this.$props.value
      }
    },
    watch: {
      inputValue(v) {
        this.$emit("input", v)
        this.change()
      },
      value(v) {
        this.inputValue = v
      }
    }
  }
</script>

