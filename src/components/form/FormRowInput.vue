<template>
  <FormRowBlank :label="label">
    <input v-if="!big" :type="inputtype" v-bind:readonly="!onEdit"
           :class="{ 'form-control-plaintext': !onEdit || !editable, 'form-control': onEdit && editable }"
           v-model="inputValue"/>
    <textarea v-if="big" :type="inputtype" v-bind:readonly="!onEdit"
              :class="{ 'form-control-plaintext': !onEdit || !editable, 'form-control': onEdit && editable }"
              v-model="inputValue" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"/>
  </FormRowBlank>
</template>

<script>
  import FormRowBlank from "./FormRowBlank"
  import FormComponent from "../mixins/FormComponent"

  export default {
    name: "FormRowInput",
    mixins: [FormComponent],
    components: {FormRowBlank},
    props: {
      value: String,
      change: {
        type: Function,
        default: function () {}
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

