<template>
  <div class="mb-2 col-12">

    <div v-if="showFilesCards" @touchend="fixActionRestriction">
      <div v-if="!isFieldArray" class="box">
        <div v-if="$props['for'] !== 'view'" class="box-right"/>

        <a v-if="listFiles[0]" :href="link(listFiles[0])" :alt="listFiles[0].name" target="_blank" >
          <b-img thumbnail
                 :src="link(listFiles[0],'thumbnail')"
                 :alt="listFiles[0].name"
                 class="crop-height"/>
        </a>

        <div v-if="$props['for'] !== 'view' && listFiles[0]" class="box-bottom">
          <bk-button-icon
              @click="onRemove(listFiles[0],index)"
              icon="trash-fill"
              variant="danger"
              class="ml-auto mr-2"
          />
        </div>

      </div>
      <b-container v-else class="p-2 bg-dark overflow-x">

          <Container @drop="onDrop"
                     orientation="horizontal"
                     behaviour="contain"
                     drag-class="card-ghost bg-info"
                     drop-class="card-ghost-drop">
            <Draggable v-for="(file,index) in listFiles" :key="file._id" class="mt-2">
              <div class="box draggable-item-horizontal">

                <div v-if="$props['for'] !== 'view' && isFieldArray" class="box-top">
                  <b-icon class="dragicon" icon="arrows-move"></b-icon>
                </div>

                <div v-if="$props['for'] !== 'view'" class="box-right"/>

                <a :href="link(file)" :alt="file.name" target="_blank">
                  <b-img thumbnail
                         :src="link(file,'thumbnail')"
                         :alt="file.name"
                         class="crop-height"/>
                </a>

                <div v-if="$props['for'] !== 'view'" class="box-bottom">
                  <bk-button-icon
                      @click="onRemove(file,index)"
                      icon="trash-fill"
                      variant="danger"
                      class="ml-auto mr-2"
                  />
                </div>

              </div>
            </Draggable>
          </Container>

      </b-container>
    </div>
    <b-overlay v-if="$props['for'] !== 'view'" :show="currentUpload">

      <b-form-file
          ref="inputFile"
          v-bind="$attrs"
          v-model="inputFiles"
          :multiple="isFieldArray"
          :accept="accept"
          @input="onFilesAdded"
          class="b-form-file">

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
import { Class, ListField } from "meteor/jagi:astronomy"
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
    showFilesCards: Boolean,
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
      isInForm: this.$props["for"],
      localFilesLinks: {},
    }
  },
  created() {
    if (this.$props["for"] !== "new")
      this.findFiles()
  },
  mounted() {
    /***
     * Bugfix z-index=-5 from b-form-input on some page : input not accessible.
     * Drop won't work for IE11
     */
    let elemInputFile = this.$refs.inputFile?.$el?.getElementsByTagName("input")[0]
    if (elemInputFile) elemInputFile.style.zIndex = 2;
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
      return this.model.getDefinition(this.field) instanceof ListField
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
          _id: { $in: self.files },
        };

        let f=Files.find(search);

        // Sort in the same order as in the model array of files
        self.listFiles = f && f.fetch().sort((a, b) =>
            self.files.indexOf(a._id) - self.files.indexOf(b._id)
        )
      })
    },
    link(file,format) {
      // Return locally uploaded file to avoid downloading unusefully
      if (this.localFilesLinks[file.name+file.size]) {
        return this.localFilesLinks[file.name+file.size]
      }
      // Return original link if version not found
      return (file.versions[format]) ? Files.link(file,format) : Files.link(file);
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

      if (this.isFieldArray) {
        this.totalFiles--
        this.model[this.field].splice(index,1)
      } else {
        this.totalFiles = 0
        this.model[this.field] = undefined
      }

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
        self.localFilesLinks[file.name+file.size] = URL.createObjectURL(file);
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

.overflow-x {
  overflow-x: auto;
}

.box {
  position: relative;
  margin-right: 4px;
  width: 110px;
  height: 75px;
}

.box-top{
  position: absolute;
  left: 85px;
  top: 5px;
  z-index: 2;
}

.box-right {
  position: absolute;
  right: 4px;
  top: 0.25rem;
  bottom: 0.25rem;
  width: 25px;
  background: white;
  opacity: 0.5;
  z-index: 1;
}

.box-bottom{
  position: absolute;
  left: 85px;
  top: 46px;
  z-index:2;
}

.crop-height {
  height: 75px;
  width: 110px;
  object-fit: cover;
}

.dragicon:hover{
  transform:scale(1.3);
}

</style>