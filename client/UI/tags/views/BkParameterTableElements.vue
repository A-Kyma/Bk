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

          <template #cell()="{model,index,field}">
            <span v-if="Array.isArray(model[field]) && isSubClass(model,field)">
              {{model[field].length}}
            </span>
            <span v-else-if="typeof model[field] === 'string' && model[field].length > 25">
              {{model[field].substring(0,20)}}...
            </span>
            <bk-view-inner v-else no-label :model="model" :field="field"/>
          </template>

      </bk-table>
    </template>
  </bk-page>
</template>

<script>
import {Class} from "meteor/jagi:astronomy"

export default {
  name: "BkParameterTableElements",
  methods: {
    exclude(model) {
      if (model.classBehind)
        return ['_id','type','field']
      else
        return ['_id','type','classBehind','field','fieldValue']
    },
    isSubClass(model,field) {
      const definition = model.getDefinition(field)
      if (!definition) return false
      if (Class.includes(definition.type.class)) return true
      return false
    }
  },
}
</script>

<style scoped>

</style>