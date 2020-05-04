<template>
    <div>
        <b-button
                v-if="$props['for'] !== 'view'"
                @click="onSubmit"
                type="submit"
                variant="primary">
            {{submit}}
        </b-button>
        <b-button
                v-if="$props['for'] !== 'view'"
                @click="onReset"
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
  import { ReactiveVar} from "meteor/reactive-var";

  export default {
    name: "BkSubmit",
      props: {
        model: Class,
        formModel: ReactiveVar,
        for: String,
      },
    computed: {
      name() {
        return this.data;
      }
    },
    methods: {
      onSubmit(e) {
        e.preventDefault()
        let model=this.model;
        model.save({stopOnFirstError:false})
      },
      onReset(e) {
        e.preventDefault()
        console.log("reset");
        let model=this.model;
        let newModel;
        if (model.isPersisted()) {
          newModel = model.constructor.findOne(model._id);
        } else {
          newModel = new (model.constructor)();
        }
        this.formModel.set(newModel);
      },
      onCancel(e) {
        // Needs to go back
      }
    },
    meteor: {
      submit() {
        return I18n.t("app." + this.$props.for)
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