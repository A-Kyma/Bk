<template>
  <b-modal
      :id="id"
      @ok="onOk"
      v-bind="$attrs"
      @shown="$emit('shown')"
      @hide="$emit('hide')"
  >
    <template #modal-title>
      <slot name="title">
        <t>{{title}}</t>
      </slot>
    </template>

    <template #modal-ok>
      <slot name="ok">
      <t>app.ok</t>
      </slot>
    </template>
    <template #modal-cancel>
        <t>app.cancel</t>
    </template>

    <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="props">
      <slot :name="slot" v-bind="props" />
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
    },
    show() {
      this.$bvModal.show(this.id)
    },
    hide() {
      this.$bvModal.hide(this.id)
    }
  },
}
</script>

<style scoped>
  .BkButton:hover{
    transform:scale(1.3);
  }
</style>