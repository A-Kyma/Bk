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

    <div>
      <Container @drop="onDrop"
                 drag-handle-selector=".column-drag-handle"
                 drag-class="opacity-ghost"
                 drop-class="opacity-ghost-drop">
        <Draggable v-for="(file,index) in findFiles" :key="file._id">
          <div class="draggable-item">
            <span class="column-drag-handle" style="float:left; padding:0 10px;">&#x2630;</span>
            <a :href="file.link()" :alt="file.name" target="_blank">
              {{file.name}}
            </a>
            <bk-button-icon
                @click="onRemove(file,index)"
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
import applyDrag from "../../../utils/applyDrag";

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
      inputFiles: null,
      currentUpload: false,
      progress: 0,
      progressArray: [0],
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
    files() {
      return this.model && this.model[this.field];
    },
    findFiles() {
      // Avoid meteor reactive data group that leads to a loop in recalculation,
      // So we use $autorun in a computed group
      return this.$autorun(() => {
        let search = {
          _id: { $in: this.files },
        };

        let f=Files.find(search);

        // Sort in the same order as in the model array of files
        return f && f.each().sort((a, b) => this.files.indexOf(a._id) - this.files.indexOf(b._id))
      })
    },
  },
  methods: {
    updateProgress(index,progress) {
      this.progressArray[index] = progress;
      this.progress = this.progressArray.reduce((a,b)=>a+b)/this.progressArray.length
    },
    onDrop(dropResult) {
      applyDrag(this.model[this.field],dropResult);
      this.model.save({fields:[this.field]})
    },
    onRemove(file,index) {
      this.model[this.field].splice(index,1);
      this.model.save({fields:[this.field]})
    },
    onFilesAdded(files) {
      const self = this;

      if (!Match.test(files,Array)) files = [files];
      if (files.length === 0) return;

      self.progressArray = Array(files.length).fill(0);
      self.currentUpload = true

      files.forEach((file,index) => {
        self.progressArray[index] = 0
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

        uploadInstance.on('progress', function(progress,fileData) {
          self.updateProgress(index,progress);
        })

        uploadInstance.on('end', function(err,result) {
          self.inputFiles=null;
          if (err) {
            alert("error")
          } else {
            self.model[self.field].push(result._id);
            self.model.save({fields:[self.field]},(err,result) => {
              if (err) {
                console.log(err)
              } else {
                self.currentUpload = false;
              }
            }); // TODO: check for result
          }
        })

        uploadInstance.start();

      })
    },
  },
}
</script>

<style scoped>

</style>