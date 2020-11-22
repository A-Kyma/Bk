<template>
    <div>
        <b-button
                v-if="$props['for'] !== 'view'"
                type="submit"
                variant="outline-primary">
            <t>{{submit}}</t>
        </b-button>
        <b-button
                v-if="$props['for'] !== 'view' && !toast"
                type="reset"
                variant="outline-danger">
          <t>app.reset</t>
        </b-button>
        <b-button
                v-if="!toast"
                type="button"
                @click="onCancel"
                variant="outline-secondary">
          <t>app.cancel</t>
        </b-button>
    </div>
</template>

<script>
  import {Class} from 'meteor/jagi:astronomy';

  export default {
    name: "BkSubmit",
      props: {
        for: String,
        toast: Boolean,
      },
    computed: {
      name() {
        return this.data;
      },
      submit() {
        if (this.for) {
          return "app." + this.for;
        }
        return "app.submit";
      }
    },
    methods: {
      onCancel(e) {
        this.$emit('cancel');
      }
    },
    meteor: {

    }
  }
</script>

<style scoped>

</style>