<template>
    <div class="mt-2">
        <b-button
                v-if="$props['for'] !== 'view' && !excludeButtons.includes('submit')"
                type="submit"
                variant="outline-primary">
            <t :key="submit">{{submit}}</t>
        </b-button>
        <b-button
                v-if="$props['for'] !== 'view' && !toast && !excludeButtons.includes('reset')"
                type="reset"
                variant="outline-danger">
          <t>app.reset</t>
        </b-button>
        <b-button
                v-if="!toast && !excludeButtons.includes('cancel')"
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
        excludeButtons: { type: Array, default() {return []}},
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
        this.$emit('cancel',e);
      }
    },
    meteor: {

    }
  }
</script>

<style scoped>

</style>