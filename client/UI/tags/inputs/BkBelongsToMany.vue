<template>
  <b-form-radio-group
    v-if="!plaintext && $props['for'] !== 'view' && ui.template === 'BFormRadioGroup'"
    v-bind="{...$props,...$attrs,...uiComponentProps}"
    v-model="model[field]"
    :name="formFieldComputed"
    :disabled="plaintext"
    class="form-control-plaintext"
    @change="onSelectRow({value: $event})"
  >
    <b-form-radio v-for="item in options || relationList"
                  :value="item.value" :key="item.value">
      {{item.text}}
    </b-form-radio>
  </b-form-radio-group>
  <div v-else-if="!plaintext && $props['for'] !== 'view'" :class="'input-group ' + classSingleOrTag">
    <multiselect
      ref="select"
      class="form-control p-0"
      v-bind="$attrs"
      v-model="inputRelation"
      :options="options || relationList"
      label="text"
      track-by="value"
      :show-labels="false"
      :disabled="disabledData"
      :placeholder="placeholder"
      :tagPlaceholder="tagPlaceholder"
      :loading="!ready"
      :taggable="taggable"
      :close-on-select="!isArray"
      :clear-on-select="!isArray"
      :limit="limit"
      :multiple="isArray"
      :searchable="searchableData"
      :max="maxTags"
      @search-change="search"
      @select="onSelectRow"
      @tag="$emit('tag',{model,field,value: $event})"
      @remove="onRemoveTag"
      @open="onOpenDropdown"
      @close="onCloseDropdown"
      @blur.prevent="false"
    >

    <template #option="data">
      <slot :name="formFieldComputed + '-option'" v-bind="data"/>
    </template>

    <template #tag="data">
      <slot :name="formFieldComputed + '-tag'" v-bind="data"/>
    </template>

    <template #singleLabel="data">
      <slot :name="formFieldComputed + '-single'" v-bind="data"/>
    </template>

    <template #maxElements>
        <t :options="{'count': maxTags}">app.maxTags</t>
    </template>

    <template #noResult>
      <span>
        <slot :name="formFieldComputed + '-noResult'">
          <t>app.notFound</t>
        </slot>
      </span>
    </template>
    <span slot="noOptions"><t>app.noData</t></span>
    <strong slot="limit">
      <t v-if="isArray" :options="{'count': getId.length}">app.selected</t>
      <t v-else :options="{'count': getId? 1:0}">app.selected</t>
      <i v-if="limit===0" slot="clear" class="multiselect__clear" @mousedown.prevent="onRemoveAllTags"/>
    </strong>
    <i v-if="taggable && !disabledData" slot="clear" class="multiselect__clear" @mousedown.prevent="onRemoveAllTags"/>
    <span v-if="disabledData" slot="caret"></span>
    <span v-if="isArray" slot="singleLabel" class="d-none"></span>
  </multiselect>

    <b-input-group-append>
      <b-button
          v-if="searchableComputed && selectInput && !disabledData"
          size="sm"
          @click.prevent="allowSearch"
          variant="dark"
          class="input-group-append align-items-center">
        <b-icon-search class=""/>
      </b-button>

      <slot
          :name="formFieldComputed + '-append'"
          v-bind="{...$props, ...{oldValue, value: getId}}"
      />
    </b-input-group-append>
    <slot :name="formFieldComputed+'-after'"
          v-bind="{...$props, oldValue, value: getId, options: relationList, ready, removeId, removeAll}"
    />
  </div>
  <span v-else class="form-control-plaintext">
    {{viewInputRelation}}
  </span>

</template>

<script>
import {Class} from "meteor/jagi:astronomy"
import Multiselect from 'vue-multiselect'
import I18n from "../../../../lib/classes/i18n";
import relationSubscriptionMixin from "../../../utils/relationSubscriptionMixin";
// import 'vue-multiselect/dist/vue-multiselect.min.css'

export default {
  name: "BkBelongsToMany",
  components: {Multiselect},
  mixins: [relationSubscriptionMixin],
  props: {
    taggable: {
      type: Boolean,
      default: true,
    },
    maxTags: {
        type: Number,
    },
    searchable: {
      type: Boolean,
      default: undefined
    },
    limit: Number,
    formField: String,
  },
  data() {
    return {
      searchableData: undefined,
      disabledData: this.disabled
    }
  },
  computed: {
    searchableComputed() {
      if (!this.selectInput) return true // if it's an autocomplete tag
      if (this.searchable !== undefined) return this.searchable // forced by upper tag
      if (this.definition.searchable !== undefined) return this.definition.searchable // forced by definition
      return true
    },
    formFieldComputed() {
      return this.formField || this.field;
    },
    classSingleOrTag() {
      if (!this.isArray) return "bk-multiselect--single"
      return "bk-multiselect--tag"
    }
  },
  meteor: {
    tagPlaceholder() {
      if (this.definition.searchable)
        return I18n.get("app.clickAdd")
      return I18n.get("app.notFound")
    },
    placeholder() {
      if (this.searchableData || !this.selectInput)
        return I18n.get("app.search")
      else
        return I18n.get("app.select")
    }
  },
  methods: {

  },
}
</script>

<!-- New step!
     Add Multiselect CSS. Can be added as a static asset or inside a component. -->
<!--<style src=".npm/package/node_modules/vue-multiselect/dist/vue-multiselect.min.css"></style>-->

<style>
fieldset[disabled] .multiselect {
  pointer-events: none
}

.bk-multiselect--tag .input-group-append .btn,
.bk-multiselect--single .input-group-append .btn,
.multiselect.form-control {
  height: auto;
  border: 0;
}

.multiselect__spinner {
  position: absolute;
  right: 1px;
  top: 1px;
  width: 48px;
  height: 35px;
  background: #fff;
  display: block
}

.multiselect__spinner:after, .multiselect__spinner:before {
  position: absolute;
  content: "";
  top: 50%;
  left: 50%;
  margin: -8px 0 0 -8px;
  width: 16px;
  height: 16px;
  border-radius: 100%;
  border: 2px solid transparent;
  border-top-color: #41b883;
  box-shadow: 0 0 0 1px transparent
}

.multiselect__spinner:before {
  animation: spinning 2.4s cubic-bezier(.41, .26, .2, .62);
  animation-iteration-count: infinite
}

.multiselect__spinner:after {
  animation: spinning 2.4s cubic-bezier(.51, .09, .21, .8);
  animation-iteration-count: infinite
}

.multiselect__loading-enter-active, .multiselect__loading-leave-active {
  transition: opacity .4s ease-in-out;
  opacity: 1
}

.multiselect__loading-enter, .multiselect__loading-leave-active {
  opacity: 0
}

.multiselect, .multiselect__input, .multiselect__single {
  font-family: inherit;
  font-size: 16px;
  -ms-touch-action: manipulation;
  touch-action: manipulation
}

.multiselect {
  box-sizing: content-box;
  display: block;
  position: relative;
  width: 100%;
  min-height: 40px;
  /*min-width: 180px !important;*/
  text-align: left;
  color: #35495e
}

.multiselect * {
  box-sizing: border-box
}

.multiselect:focus {
  outline: none
}

.multiselect--disabled {
  background: #ededed;
  pointer-events: none;
  opacity: .6
}

.multiselect--active {
  z-index: 50
}

.multiselect--active:not(.multiselect--above) .multiselect__current, .multiselect--active:not(.multiselect--above) .multiselect__input, .multiselect--active:not(.multiselect--above) .multiselect__tags {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0
}

.multiselect--active .multiselect__select {
  transform: rotate(180deg)
}

.multiselect--above.multiselect--active .multiselect__current, .multiselect--above.multiselect--active .multiselect__input, .multiselect--above.multiselect--active .multiselect__tags {
  border-top-left-radius: 0;
  border-top-right-radius: 0
}

.multiselect__input, .multiselect__single {
  position: relative;
  display: inline-block;
  min-height: 20px;
  line-height: 20px;
  border: none;
  border-radius: 5px;
  background: #fff;
  padding: 0 0 0 5px;
  width: 100%;
  transition: border .1s ease;
  box-sizing: border-box;
  margin-bottom: 8px;
  vertical-align: top
}

.multiselect__input:-ms-input-placeholder {
  color: #35495e
}

.multiselect__input::placeholder {
  color: #35495e
}

.multiselect__tag ~ .multiselect__input, .multiselect__tag ~ .multiselect__single {
  width: auto
}

.multiselect__input:hover, .multiselect__single:hover {
  border-color: #cfcfcf
}

.multiselect__input:focus, .multiselect__single:focus {
  border-color: #a8a8a8;
  outline: none
}

.multiselect__single {
  padding-left: 5px;
  margin-bottom: 8px;
}

.bk-multiselect--tag .multiselect__single {
  display: none;
}

.bk-multiselect--tag .multiselect {
  min-width: 180px !important;
}

.bk-multiselect--single .multiselect {
  min-width: 120px !important;
}

.multiselect__tags-wrap {
  display: inline
}

.multiselect__tags {
  min-height: 40px;
  display: block;
  padding: 8px 40px 0 8px;
  border-radius: 5px;
  border: 1px solid #e8e8e8;
  background: #fff;
  font-size: 14px
}

.multiselect__tag {
  position: relative;
  display: inline-block;
  padding: 4px 26px 4px 10px;
  border-radius: 5px;
  margin-right: 10px;
  color: #fff;
  line-height: 1;
  background: #41b883;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis
}

.multiselect__tag-icon {
  cursor: pointer;
  margin-left: 7px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  font-weight: 700;
  font-style: normal;
  width: 22px;
  text-align: center;
  line-height: 22px;
  transition: all .2s ease;
  border-radius: 5px
}

.multiselect__tag-icon:after {
  content: "\D7";
  color: #266d4d;
  font-size: 14px
}

.multiselect__tag-icon:focus, .multiselect__tag-icon:hover {
  background: #369a6e
}

.multiselect__tag-icon:focus:after, .multiselect__tag-icon:hover:after {
  color: #fff
}

.multiselect__current {
  min-height: 40px;
  overflow: hidden;
  padding: 8px 30px 0 12px;
  white-space: nowrap;
  border-radius: 5px;
  border: 1px solid #e8e8e8
}

.multiselect__current, .multiselect__select {
  line-height: 16px;
  box-sizing: border-box;
  display: block;
  margin: 0;
  text-decoration: none;
  cursor: pointer
}

.multiselect__select {
  position: absolute;
  width: 40px;
  height: 38px;
  right: 1px;
  top: 1px;
  padding: 4px 8px;
  text-align: center;
  transition: transform .2s ease
}

.multiselect__select:before {
  position: relative;
  right: 0;
  top: 65%;
  color: #999;
  margin-top: 4px;
  border-color: #999 transparent transparent;
  border-style: solid;
  border-width: 5px 5px 0;
  content: ""
}

.multiselect__clear {
  cursor: pointer;
  position: absolute;
  width: 22px;
  height: 38px;
  right: 25px;
  top: 1px;
  padding: 8px 8px;
  font-weight: 700;
  font-style: normal;
  text-align: center;
  line-height: 22px;
  transition: all .2s ease;
  border-radius: 5px

}

.multiselect__clear:after {
  content: "\D7"; /* character x */
  /*color: #266d4d;*/
  font-size: 14px
}

/* box around the x when selected */
/*
.multiselect__clear:focus, .multiselect__clear:hover {
  background: #369a6e
}
*/

.multiselect__clear:focus:after, .multiselect__clear:hover:after {
  color: grey;
}

.multiselect__placeholder {
  color: #adadad;
  display: inline-block;
  margin-bottom: 10px;
  padding-top: 2px
}

.multiselect--active .multiselect__placeholder {
  display: none
}

.multiselect__content-wrapper {
  position: absolute;
  display: block;
  background: #fff;
  width: 100%;
  max-height: 240px;
  overflow: auto;
  border: 1px solid #e8e8e8;
  border-top: none;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  z-index: 50;
  -webkit-overflow-scrolling: touch
}

.multiselect__content {
  list-style: none;
  display: inline-block;
  padding: 0;
  margin: 0;
  min-width: 100%;
  vertical-align: top
}

.multiselect--above .multiselect__content-wrapper {
  bottom: 100%;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom: none;
  border-top: 1px solid #e8e8e8
}

.multiselect__content::webkit-scrollbar {
  display: none
}

.multiselect__element {
  display: block
}

.multiselect__option {
  display: block;
  padding: 12px;
  min-height: 40px;
  line-height: 16px;
  text-decoration: none;
  text-transform: none;
  vertical-align: middle;
  position: relative;
  cursor: pointer;
  white-space: nowrap
}

.multiselect__option:after {
  top: 0;
  right: 0;
  position: absolute;
  line-height: 40px;
  padding-right: 12px;
  padding-left: 20px;
  font-size: 13px
}

.multiselect__option--highlight {
  background: #41b883;
  outline: none;
  color: #fff
}

.multiselect__option--highlight:after {
  content: attr(data-select);
  background: #41b883;
  color: #fff
}

.multiselect__option--selected {
  background: #f3f3f3;
  color: #35495e;
  font-weight: 700
}

.multiselect__option--selected:after {
  content: attr(data-selected);
  color: silver
}

.multiselect__option--selected.multiselect__option--highlight {
  background: #ff6a6a;
  color: #fff
}

.multiselect__option--selected.multiselect__option--highlight:after {
  background: #ff6a6a;
  content: attr(data-deselect);
  color: #fff
}

.multiselect--disabled .multiselect__current, .multiselect--disabled .multiselect__select {
  background: #ededed;
  color: #a6a6a6
}

.multiselect__option--disabled {
  background: #ededed !important;
  color: #a6a6a6 !important;
  cursor: text;
  pointer-events: none
}

.multiselect__option--group {
  background: #ededed;
  color: #35495e
}

.multiselect__option--group.multiselect__option--highlight {
  background: #35495e;
  color: #fff
}

.multiselect__option--group.multiselect__option--highlight:after {
  background: #35495e
}

.multiselect__option--disabled.multiselect__option--highlight {
  background: #dedede
}

.multiselect__option--group-selected.multiselect__option--highlight {
  background: #ff6a6a;
  color: #fff
}

.multiselect__option--group-selected.multiselect__option--highlight:after {
  background: #ff6a6a;
  content: attr(data-deselect);
  color: #fff
}

.multiselect-enter-active, .multiselect-leave-active {
  transition: all .15s ease
}

.multiselect-enter, .multiselect-leave-active {
  opacity: 0
}

.multiselect__strong {
  margin-bottom: 8px;
  line-height: 20px;
  display: inline-block;
  vertical-align: top
}

[dir=rtl] .multiselect {
  text-align: right
}

[dir=rtl] .multiselect__select {
  right: auto;
  left: 1px
}

[dir=rtl] .multiselect__tags {
  padding: 8px 8px 0 40px
}

[dir=rtl] .multiselect__content {
  text-align: right
}

[dir=rtl] .multiselect__option:after {
  right: auto;
  left: 0
}

[dir=rtl] .multiselect__clear {
  right: auto;
  left: 12px
}

[dir=rtl] .multiselect__spinner {
  right: auto;
  left: 1px
}

@keyframes spinning {
  0% {
    transform: rotate(0)
  }
  to {
    transform: rotate(2turn)
  }
}
#filter-header .btn-group-toggle label.btn {
  display: inline-block;
}
</style>
