<template>
  <b-modal
      ref="modal"
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
import {Class} from "meteor/akyma:astronomy"

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
      this.$emit('show')
      if (!!this.subscription)
        this.$subscribe(this.subscription,[this.model._id])
    },
    show() {
      // bootstrap-vue-3 uses component instance methods; fallback to $bvModal for Vue2
      if (this.$refs.modal && typeof this.$refs.modal.show === 'function') {
        this.$refs.modal.show()
        return
      }
      if (this.$bvModal && typeof this.$bvModal.show === 'function') {
        this.$bvModal.show(this.id)
      }
    },
    hide() {
      if (this.$refs.modal && typeof this.$refs.modal.hide === 'function') {
        this.$refs.modal.hide()
        return
      }
      if (this.$bvModal && typeof this.$bvModal.hide === 'function') {
        this.$bvModal.hide(this.id)
      }
    }
  },
}
</script>

<style scoped>
  .BkButton:hover{
    transform:scale(1.3);
  }
</style>