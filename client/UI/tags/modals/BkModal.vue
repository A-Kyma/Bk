<template>
  <b-modal :id="id" @ok="onOk" v-bind="$attrs">
    <template #modal-title>
      <slot name="title">
        <t>{{title}}</t>
      </slot>
    </template>

    <slot></slot>

    <template #modal-ok>
      <t>app.ok</t>
    </template>
    <template #modal-cancel>
      <t>app.cancel</t>
    </template>
  </b-modal>
</template>

<script>
import {Class} from "meteor/jagi:astronomy"

export default {
  name: "BkModal",
  props: {
    id: String,
    model: Class,
    field: String,
    title: {
      type: String,
      default: "app.chooseType"
    }
  },
  methods: {
    onOk(e) {
      this.$emit("ok",e);
    }
  },
}
</script>

<style scoped>
  .BkButton:hover{
    transform:scale(1.3);
  }
</style>