<template>
  <div class="mb-2">

    <b-overlay :show="currentUpload">

      <b-form-file
          ref="inputFile"
          v-bind="$attrs"
          v-model="inputFiles"
          :multiple="isFieldArray"
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

    <div v-if="showFilesList" @touchend="fixActionRestriction">
      <b-list-group>
        <Container @drop="onDrop"
                   drag-class="card-ghost bg-info"
                   drop-class="card-ghost-drop">

          <Draggable v-for="(file,index) in listFiles" :key="file._id" class="mt-2">
            <div class="draggable-item">
            <b-list-group-item class="d-flex align-items-center">
              <b-avatar :src="link(file,'thumbnail')" :text="file.ext" class="mr-3"/>

              <a :href="link(file)" :alt="file.name" target="_blank">
                {{file.name}}
              </a>

              <bk-button-icon
                  @click="onRemove(file,index)"
                  icon="trash-fill"
                  variant="danger"
                  class="ml-auto mr-2"
              />
              <b-icon icon="arrows-move"></b-icon>
            </b-list-group-item>
            </div>
          </Draggable>

        </Container>
      </b-list-group>
    </div>
  </div>
</template>

<script>
import { Class } from "meteor/jagi:astronomy"
import { Match } from "meteor/check"
import { Files } from "meteor/a-kyma:bk"
import { Container, Draggable } from "vue-smooth-dnd";
import applyDrag from "../../../utils/applyDrag";
import I18n from "../../../../lib/classes/i18n";

export default {
  name: "BkFile",
  components: {Container,Draggable},
  props: {
    placeholder: { type: String, default: "app.file.choose" },
    dropPlaceholder: { type: String, default: "app.file.drop"},
    model: Class,
    field: String,
    for: String,
    showFilesList: Boolean,
    accept: String, // accept="image/*" for images
  },
  data() {
    return {
      inputFiles: null,
      currentUpload: false,
      progress: 100,
      progressArray: [0],
      totalFiles: this.model[this.field]?.length || 0,
      listFiles: [],
      isInForm: this.$props["for"]
    }
  },
  created() {
    if (this.$props["for"] !== "new")
      this.findFiles()
  },
  computed: {
    typeFile() {
      if (this.accept.$regex(/^image/)) {
        return "image"
      } else {
        return "file"
      }
    },
    isFieldArray() {
      return this.model.getDefinition(this.field)?.constructor.name === "ListField"
    },
    files() {
      let filesField = this.model && this.model[this.field]
      return (this.isFieldArray) ? filesField : [filesField]
    },
  },
  watch: {
    // findFiles(newValue,oldValue) {
    //   if (this.$props["for"]) return;
    //   if (newValue.length === this.totalFiles)
    //     this.currentUpload = false;
    //     if (newValue !== oldValue)
    //       this.listFiles = newValue;
    // },
    listFiles(newValue) {
      if (!this.isInForm) return;
      if (newValue.length === this.totalFiles)
        this.currentUpload = false;
    }
  },
  methods: {
    findFiles() {
      // Avoid meteor reactive data group that leads to a loop in recalculation,
      // So we use $autorun in a computed group
      const self=this;
      return Tracker.autorun(() => {
        let search = {
          _id: { $in: this.files },
        };

        let f=Files.find(search);

        // Sort in the same order as in the model array of files
        this.listFiles = f && f.fetch().sort((a, b) =>
            self.files.indexOf(a._id) - self.files.indexOf(b._id)
        )
      })
    },
    link(file,format) {
      return Files.link(file,format);
    },
    // Avoid issues on touch screens
    fixActionRestriction() {
      document.body.classList.remove(
          "smooth-dnd-no-user-select",
          "smooth-dnd-disable-touch-action"
      );
    },
    updateProgress(index,progress) {
      this.progressArray[index] = progress;
      this.progress = this.progressArray.reduce((a,b)=>a+b)/this.progressArray.length
    },
    showError(err) {
      this.model.setError(err);
      this.$root.$bvToast.toast(I18n.t("app.file.error"),{
        title: I18n.t("app.toast.title.failed"),
        variant: "danger",
        autoHideDelay: 5000
      })
    },
    onDrop(dropResult) {
      applyDrag(this.listFiles,dropResult)
      applyDrag(this.model[this.field],dropResult);

      // if $props.for filled in, we are inside a form or a save button will exist
      if (this.isInForm) return;

      this.model.save({fields:[this.field]},(err,result)=>{
        if (err) {
          this.showError(err)
        } else {
          console.log(result)
        }
      })
    },
    onRemove(file,index) {
      const self = this;

      this.totalFiles--;
      this.model[this.field].splice(index,1);
      this.listFiles.splice(index,1);

      // if $props.for filled in, we are inside a form or a save button will exist
      if (self.isInForm) return;

      this.model.save({fields:[this.field]},(err,result) =>{
        if (err) {
          this.showError(err)
        } else {

        }
      })
    },
    onFilesAdded(files) {
      const self = this;
      if (files === null) return;
      if (!Match.test(files,Array)) files = [files];
      if (files.length === 0) return;

      if (self.isFieldArray) {
        self.totalFiles = this.model[this.field].length + files.length;
      } else {
        self.totalFiles = 1
      }

      self.progressArray = Array(files.length).fill(0);
      self.currentUpload = true

      files.forEach((file,index) => {
        self.progressArray[index] = 0
        var uploadInstance = Files.insert({
          file,
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

        uploadInstance.on('end', function(error,resultFile) {
          self.inputFiles=null;
          if (error) {
            self.showError(error)
          } else {
            if (self.isFieldArray) {
              self.listFiles.push(resultFile);
              self.model[self.field].push(resultFile._id)
            } else {
              self.listFiles = [resultFile]
              self.model[self.field] = resultFile._id
            }

            // if $props.for filled in, we are inside a form or a save button will exist
            if (self.isInForm) {
              self.currentUpload = false
              return;
            }

            self.model.save({fields:[self.field]},(err,result) => {
              self.currentUpload = false
              if (err) {
                self.showError(err)
              } else {
                self.updateProgress(index,100)
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
.card-ghost {
  transition: transform 0.18s ease;
  transform: rotateZ(1deg);
}
.card-ghost-drop {
  transition: transform 0.18s ease-in-out;
  transform: rotateZ(0deg);
}

</style>