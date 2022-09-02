<template>
  <div class="col-12 pl-0 pr-0">
    <div v-if="readonly" class="form-control-plaintext">
      {{readonlyValue}}
    </div>
    <b-row v-else>
      <b-col lg="8" md="12" class="nopaddingleft">
        <b-form-datepicker
          ref="datepicker"
          v-model="dateValue"
          :locale="locale"
          :placeholder="placeholder"
          :state="state"
          :disabled="plaintext"
          start-weekday="1"
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
import {DateTime,I18n} from "meteor/akyma:bk"


export default {
  name: "BkDatePicker",
  props: {
    state: Boolean,
    for: String,
    placeholder: String,
    plaintext: Boolean,
    value: Date,
  },
  created() {
    if (this.readonly) return
    let minute = this.value.getMinutes()
    let remainder = minute % 5
    if (remainder !== 0) {
      minute = minute + 5 - remainder
      this.value.setMinutes(minute)
      let d = DateTime.getISODateString(this.value)
      let h = this.timeValue
      this.$emit("input",`${d}T${h}`)
    }


  },
  computed: {
    readonly() {
      return (this.plaintext || this.$props.for === "view")
    },
    dateValue: {
      set(value) {
        let newValue
        if (value === undefined || value === "")
          newValue = undefined
        else
          if (this.timeValue === undefined)
            newValue = value + "T00:00"
          else
            newValue = value + "T" + this.timeValue //,{cast: true}
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
    readonlyValue() {
      return DateTime.getLongDateTime(this.value,this.locale)
    }
  },
  meteor: {
    labelClose() {
      return I18n.get("app.close")
    },
    locale() {
      return I18n.getLanguage()
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