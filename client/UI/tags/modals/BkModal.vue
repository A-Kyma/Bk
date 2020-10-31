<template>
  <b-modal :id="id" @ok="onOk">
    <template #modal-title>
      <slot name="title">
        <t>app.chooseType</t>
      </slot>
    </template>

    <slot></slot>

    <template #modal-ok>
      <t>app.add</t>
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