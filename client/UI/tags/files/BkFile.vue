<template>
  <div>

    <b-overlay :show="currentUpload">

      <b-form-file
          ref="inputFile"
          v-bind="$attrs"
          v-model="inputFiles"
          multiple
          :accept="accept"
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

    </b-overlay>

    <b-progress
        v-if="currentUpload"
        :value="progress"
        show-progress
        animated
        striped
        class="mt-2 mb-2"
    />

    <div v-if="!$subReady['files.model'] && !firstSubReady">
      <bk-loading/>
    </div>
    <div v-else>
      <Container @drop="onDrop" drag-handle-selector=".column-drag-handle">
        <Draggable v-for="(file,index) in findFiles" :key="file._id">
          <div class="draggable-item">
            <span class="column-drag-handle" style="float:left; padding:0 10px;">&#x2630;</span>
            <a :href="file.link()" :alt="file.name" target="_blank">
              {{file.name}}
            </a>
            <bk-button-icon
                @click="onRemove(index)"
                icon="trash-fill"
                variant="danger"
            />
          </div>
        </Draggable>
      </Container>
    </div>
  </div>
</template>

<script>
import { Class } from "meteor/jagi:astronomy"
import { Match } from "meteor/check"
import { Files } from "meteor/a-kyma:bk"
import { Container, Draggable } from "vue-smooth-dnd";

export default {
  name: "BkFile",
  components: {Container,Draggable},
  props: {
    placeholder: { type: String, default: "app.file.choose" },
    dropPlaceholder: { type: String, default: "app.file.drop"},
    model: Class,
    field: String,
    accept: String, // accept="image/*" for images
  },
  data() {
    return {
      inputFiles: [],
      currentUpload: false,
      progress: 0,
      firstSubReady: false,
    }
  },
  computed: {
    typeFile() {
      if (this.accept.$regex(/^image/)) {
        return "image"
      } else {
        return "file"
      }
    },
    files: {
      set(value) {
        if (Array.isArray(value))
          this.model[this.field] = value;
        else
          this.model[this.field].push(value);
      },
      get() {
        return this.model && this.model[this.field];
      }
    },
  },
  meteor: {
    $subscribe: {
      // Get the files for current model
      "files.model": function () {
        return [
            this.model.constructor.getName(),
            this.model._id,
            this.field,
            this.files,
        ]
      },
    },
    findFiles() {
      if (!this.$subReady["files.model"]) return [];
      this.firstSubReady = true;
      let search = {
        _id: { $in: this.files },
      };
      let f=Files.find(search);
      return f && f.each();
    },
  },
  methods: {
    onDrop(dropped) {
      let files = this.model[this.field]
      if (dropped.removeIndex === dropped.addIndex) return
      let item = files[dropped.removeIndex];
      if (dropped.removeIndex > dropped.addIndex) {
        files.splice(dropped.removeIndex,1)
        files.splice(dropped.addIndex,0,item);
      } else {
        files.splice(dropped.addIndex,0,item);
        files.splice(dropped.removeIndex,1)
      }
      this.model.save({fields:[this.field]})
    },
    onRemove(index) {
      this.model[this.field].splice(index,1);
      this.model.save({fields:[this.field]})
    },
    onFilesAdded(files) {
      const self = this;
      if (!Match.test(files,Array)) files = [files];
      files.forEach(file => {
        var uploadInstance = Files.insert({
          file,
          streams: 'dynamic',
          chunkSize: 'dynamic',
          meta: {
            className: this.model.constructor.getName(),
            classId: this.model._id,
            field: this.field,
          }
        }, false);

        uploadInstance.on('start', function() {
          self.currentUpload = true
          self.progress = 0
        })

        uploadInstance.on('progress', function(progress,fileData) {
          self.progress = progress;
        })

        uploadInstance.on('end', function(err,result) {
          self.inputFiles=[];
          if (err) {
            alert("error")
          } else {
            self.model[self.field].push(result._id);
            self.model.save({fields:[self.field]}); // TODO: check for result
          }
          self.currentUpload = false;
        })

        uploadInstance.start();

      })
    },
  },
}
</script>

<style scoped>

</style>