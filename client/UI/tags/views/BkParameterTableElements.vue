<template>
  <bk-page
      model="ParameterTable"
      subscription="BkParameterTablesPublish"
      :params="[{'_id': $route.params.id }]"
  >
    <template #default="{model}">
      <bk-table
          :model="'ParameterTableElement' + $route.params.name"
          :actions="['add','view','update','delete','back']"
          subscription="BkParameterTableElementsPublish"
          :exclude="exclude(model)"
          :modal-exclude="exclude(model)"
          label-cols-sm="3"
          size="lg"
          update-route
          :filter="{
            'type': 'ParameterTableElement' + $route.params.name,
            'classBehind': model.classBehind,
            'field': model.field
          }"
          :sort="{'name': 1}"
      >

      </bk-table>
    </template>
  </bk-page>
</template>

<script>
import {Class} from "meteor/akyma:astronomy"

export default {
  name: "BkParameterTableElements",
  methods: {
    exclude(model) {
      if (model.classBehind)
        return ['_id','type','field']
      else
        return ['_id','type','classBehind','field','fieldValue']
    }
  },
}
</script>

<style scoped>

</style>