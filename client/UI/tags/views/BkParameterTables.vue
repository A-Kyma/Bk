<template>
  <bk-table
      model="ParameterTables"
      :actions="['add','view','update','delete','back']"
      subscription="BkParameterTablesPublish"
      :fields="['name','classBehind']"

  >

  </bk-table>
</template>

<script>
import {Class} from "meteor/jagi:astronomy"

export default {
  name: "BkParameterTables"
}
</script>

<style scoped>

</style>