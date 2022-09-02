<template>
  <bk-table
      model="ParameterTable"
      :actions="['add','view','update','delete','back']"
      subscription="BkParameterTablesPublish"
      :fields="['name','classBehind']"
      label-cols-sm="3"
      size="lg"
      update-route
      :sort="{'name':1}"
  >
    <template v-slot:customActions="data">

      <bk-button-icon
          :model="data.model"
          icon="list-ol"
          variant="primary"
          route="AdminParameterTableElements"
          :params="{'name': data.model.name}"
          :title="getI18n('ParameterTableOption.summary.label')"
          class="float-right"
      />
    </template>

  </bk-table>
</template>

<script>
import {Class} from "meteor/jagi:astronomy"
import {I18n} from "meteor/akyma:bk"

export default {
  name: "BkParameterTables",
  methods: {
    getI18n(key){
      return I18n.get(key)
    },
  }
}
</script>

<style scoped>

</style>