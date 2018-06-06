<template>
  <FormRowBlank :label="label">
    <input v-if="!big" :type="inputtype" v-bind:readonly="!onEdit"
           :class="{ 'form-control-plaintext': !onEdit || !editable, 'form-control': onEdit && editable }"
           v-model="inputValue"/>
    <textarea v-if="big" :type="inputtype" v-bind:readonly="!onEdit"
              :class="{ 'form-control-plaintext': !onEdit || !editable, 'form-control': onEdit && editable }"
              v-model="inputValue"/>
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
      onEdit: {
        type: Boolean,
        default: true
      },
      change: {
        type: Function,
        default: function () {
        }
      },
      editable: {
        type: Boolean,
        default: true
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

