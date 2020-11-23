<template>
  <b-form-file
      v-bind="$attrs"
      v-model="files"
      multiple
      @input="onFilesAdded">

    <template slot="placeholder">
      <t>{{placeholder}}</t>
    </template>
    <template slot="drop-placeholder">
      <t>{{dropPlaceholder}}</t>
    </template>
    <template slot="file-name" slot-scope="{ names }">
      <b-badge variant="dark">{{ names[0] }}</b-badge>
      <b-badge v-if="names.length > 1" variant="dark" class="ml-1">
        + {{ names.length - 1 }} <t>app.file.more</t>
      </b-badge>
    </template>

  </b-form-file>
</template>

<script>
import { Class } from "meteor/jagi:astronomy"
import { Match } from "meteor/check"
import { Files } from "meteor/a-kyma:bk"

export default {
  name: "BkFile",
  components: {},
  props: {
    placeholder: { type: String, default: "app.file.choose" },
    dropPlaceholder: { type: String, default: "app.file.drop"},
    model: Class,
    field: String,

  },
  data() {
    return {
      files: [],
      currentUpload: undefined,
    }
  },
  methods: {
    onFilesAdded(files) {
      const self = this;
      if (!Match.test(files,Array)) files = [files];
      files.forEach(file => {
        var uploadInstance = Files.insert({
          file,
          streams: 'dynamic',
          chunkSize: 'dynamic'
        }, false);

        uploadInstance.on('start', function() {
          self.currentUpload = this
        })

        uploadInstance.on('end', function(err,result) {
          if (err) {
            alert("error")
          } else {
            alert("file uploaded")
          }
          self.currentUpload = false;
        })

        uploadInstance.start();

      })
    }
  },
}
</script>

<style scoped>

</style>