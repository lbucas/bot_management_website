<template>
  <fr-blank :label="label">
    <input v-if="!big" :type="inputtype" :readonly="!onEdit"
           :class="{ 'form-control-plaintext': !onEdit || !editable, 'form-control': onEdit && editable, 'is-invalid': !valid}"
           v-model="inputValue"/>
    <textarea v-if="big" :type="inputtype" v-bind:readonly="!onEdit"
              :class="{ 'form-control-plaintext': !onEdit || !editable, 'form-control': onEdit && editable, 'is-invalid': !valid }"
              v-model="inputValue" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"/>
    <div class="invalid-feedback" v-if="!valid">
      {{validation}}
    </div>
  </fr-blank>
</template>

<script>
  import FormComponent from "../mixins/FormComponent"

  export default {
    name: "FormRowInput",
    mixins: [FormComponent],
    props: {
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
    }
  }
</script>

