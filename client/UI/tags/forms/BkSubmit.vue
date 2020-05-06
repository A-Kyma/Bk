<template>
    <div>
        <b-button
                v-if="$props['for'] !== 'view'"
                type="submit"
                variant="primary">
            {{submit}}
        </b-button>
        <b-button
                v-if="$props['for'] !== 'view'"
                type="reset"
                variant="danger">
            {{reset}}
        </b-button>
        <b-button
                type="button"
                @click="onCancel"
                variant="secondary">
            {{cancel}}
        </b-button>
    </div>
</template>

<script>
  import {Class} from 'meteor/jagi:astronomy';
  import I18n from "../../../../lib/classes/i18n";

  export default {
    name: "BkSubmit",
      props: {
        for: String,
      },
    computed: {
      name() {
        return this.data;
      }
    },
    methods: {
      onCancel(e) {
        this.$emit('cancel');
      }
    },
    meteor: {
      submit() {
        if (this.for) {
          return I18n.t("app." + this.for);
        }
        return I18n.t("app.submit");
      },
      reset() {
        return I18n.t("app.reset");
      },
      cancel() {
        return I18n.t("app.cancel");
      }
    }
  }
</script>

<style scoped>

</style>