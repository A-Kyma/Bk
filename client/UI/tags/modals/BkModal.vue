<template>
  <b-modal
      :id="id"
      @ok="onOk"
      @show="onShow"
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
      <slot :name="slot" v-bind="props"/>
    </template>

    <template #default="props">
      <bk-loading v-if="!!subscription && !$subReady[subscription]  && !firstSubReady" type="dots"/>
      <slot v-else name="default" v-bind="{model: findModel}"></slot>
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
    },
    subscription: String,
  },
  data() {
    return {
      firstSubReady: false
    }
  },
  computed: {
    findModel() {
      if (!this.subscription)
        return this.model
      else {
        this.firstSubReady = true
        return this.$autorun(() =>
            this.model.constructor.findOne(this.model._id)
        )
      }
    },
  },
  methods: {
    onOk(e) {
      this.$emit("ok",e);
    },
    onShow() {
      if (!!this.subscription)
        this.$subscribe(this.subscription,[this.model._id])
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