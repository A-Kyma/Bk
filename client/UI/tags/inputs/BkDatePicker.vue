<template>
  <div class="col-12">
    <b-row>
      <b-col lg="8" md="12" class="nopaddingleft">
        <b-form-datepicker
          ref="datepicker"
          v-model="dateValue"
          :placeholder="placeholder"
          :state="state"
          :disabled="plaintext"
          @hidden="selectTime"
        />
      </b-col>
      <b-col class="nopaddingleft">
        <b-form-timepicker
          ref="timepicker"
          v-model="timeValue"
          :locale="locale"
          placeholder="HH:mm"
          minutes-step="5"
          :state="state"
          :disabled="plaintext || dateValue===undefined"
          :label-close-button="labelClose"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {Class} from "meteor/jagi:astronomy"
import {DateTime,I18n} from "meteor/a-kyma:bk"


export default {
  name: "BkDatePicker",
  props: {
    state: Boolean,
    for: String,
    placeholder: String,
    plaintext: Boolean,
    value: Date,
  },
  data() {
    return {
      locale: I18n.getLanguage()
    }
  },
  computed: {
    dateValue: {
      set(value) {
        let newValue
        if (value === undefined || value === "")
          newValue = undefined
        else
          if (this.timeValue === undefined)
            newValue = value + "T00:00"
          else
            newValue = value + "T" + this.timeValue,{cast: true}
        // $emit to let BkInnerInput manage setting value into model
        this.$emit("input", newValue)
      },
      get() {
        return this.value
      }
    },
    timeValue: {
      set(value) {
        if (value === undefined || value === "") return
        let d = DateTime.getISODateString(this.value)
        let newValue = d + "T" + value
        // $emit to let BkInnerInput manage setting value into model
        this.$emit("input", newValue)
      },
      get() {
        return DateTime.getTime(this.value)
      }
    },
  },
  meteor: {
    labelClose() {
      return I18n.get("app.close")
    }
  },
  methods: {
    selectTime() {

    }
  },
}
</script>

<style scoped>

</style>