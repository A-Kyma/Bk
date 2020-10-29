<template>
  <b-link @click="onClick">
    <b-icon class="BkButton" :icon="icon" :variant="variant"/>
  </b-link>
</template>

<script>
import Class from "meteor/jagi:astronomy"

export default {
  name: "BkButtonIcon",
  props: {
    icon: String,
    variant: String,
  },
  methods: {
    onClick(e) {
      this.$emit("click",e);
    }
  },
}
</script>

<style scoped>
  .BkButton:hover{
    transform:scale(1.3);
  }
</style>