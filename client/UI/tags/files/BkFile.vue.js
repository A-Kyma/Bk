
import { Class, ListField } from "meteor/akyma:astronomy"
import { Match } from "meteor/check"
import { Files } from "meteor/akyma:bk"
import { Container, Draggable } from "vue-smooth-dnd";
import applyDrag from "../../../utils/applyDrag";
import I18n from "../../../../lib/classes/i18n";

const _sfc_main = {
  name: "BkFile",
  components: {Container,Draggable},
  props: {
    placeholder: String,
    dropPlaceholder: { type: String, default: "app.file.drop"},
    model: Class,
    field: String,
    for: String,
    type: String,
    showFilesCounter: Boolean,
    showFilesList: Boolean,
    showFilesCards: Boolean,
    lastRowBackground: String,
    accept: String, // accept="image/*" for images
    default: String,
    target: {
      type: String,
      default() {
          if (Meteor.isCordova)
            return "_system"
          return "_blank"
      }
    },
    fileFormat: {
      type: String,
      default: "normal"
    },
    slideFormat: {
      type: String,
      default: "slide"
    },
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
      visible: this.showFilesCounter ? false : true,
      imagesLastRowBackground: this.lastRowBackground ? this.lastRowBackground : "rgb(3, 124, 168)",
      activeImageSrc: String,
      activeImageText: String,
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
      if (this.accept?.startsWith('image')) {
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
    isAvatar() {
      let definition = this.model.getDefinition(this.field)
      if (definition instanceof ListField) return false
      return definition.type.name === "Avatar";
    },
    placeholderComputed() {
      if (this.placeholder) return this.placeholder
      if (this.isFieldArray)
        return "app.file.choose.other"
      else
        return "app.file.choose.one"
    },
    cssProps() {
      return {
        '--last-row-background': this.imagesLastRowBackground,
      }
    }
  },
  meteor: {
    placeholderTranslated() {
      return I18n.t(this.placeholderComputed)
    }
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
      if (!file) return
      // Return locally uploaded file to avoid downloading unusefully
      if (this.localFilesLinks[file.name+file.size]) {
        return this.localFilesLinks[file.name+file.size]
      }
      // Return original link if version not found
      return (file.versions[format]) ? Files.link(file,format) : Files.link(file);
    },
    openModal(e, file){
      this.activeImageSrc = this.link(file,this.slideFormat)
      this.activeImageText = file.name
      this.$refs['image-modal'].show()
    },
    closeModal(e){
      this.$refs['image-modal'].hide()
    },
    staticLink(format) {
      let fileId = this.model[this.field]
      if (!format) format="original"
      if (fileId === undefined && this.default) return this.default
      if (fileId === undefined) return
      return Meteor.absoluteUrl("/cdn/storage/Files/" + fileId + "/" + format + "/" + fileId + ".jpg")
    },
    openLink(link,e) {
      if (Meteor.isCordova && cordova?.InAppBrowser) {
        e.preventDefault()
        cordova.InAppBrowser.open(link, this.target)
      } else {
        e.preventDefault()
        window.open(link, this.target)
      }
    },
    fileIcon(ext) {
      switch(ext) {
        case "pdf": {
          return "file-earmark-pdf"
        }
      }
    },
    fileIconVariant(ext) {
      switch(ext) {
        case "pdf": {
          return "outline-danger"
        }
      }
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


export default _sfc_main;

import { createElementVNode as _createElementVNode, resolveComponent as _resolveComponent, createVNode as _createVNode, withCtx as _withCtx, renderList as _renderList, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, normalizeStyle as _normalizeStyle, createCommentVNode as _createCommentVNode, createBlock as _createBlock, normalizeProps as _normalizeProps, guardReactiveProps as _guardReactiveProps, renderSlot as _renderSlot, mergeProps as _mergeProps, createSlots as _createSlots, toDisplayString as _toDisplayString, createTextVNode as _createTextVNode, vShow as _vShow, withDirectives as _withDirectives, normalizeClass as _normalizeClass } from "vue/dist/vue.runtime.esm-bundler.js"

const _hoisted_1 = { key: 0 }
const _hoisted_2 = { class: "container mb-2" }
const _hoisted_3 = {
  key: 1,
  class: "mb-2 w-100"
}
const _hoisted_4 = {
  key: 0,
  class: "box"
}
const _hoisted_5 = {
  key: 0,
  class: "box-right"
}
const _hoisted_6 = ["href", "alt", "target"]
const _hoisted_7 = ["href", "target"]
const _hoisted_8 = {
  key: 3,
  class: "box-bottom"
}
const _hoisted_9 = { class: "box draggable-item-horizontal" }
const _hoisted_10 = {
  key: 0,
  class: "box-top"
}
const _hoisted_11 = {
  key: 1,
  class: "box-right"
}
const _hoisted_12 = ["href", "alt", "target", "onClick"]
const _hoisted_13 = {
  key: 2,
  class: "box-bottom"
}
const _hoisted_14 = { slot: "drop-placeholder" }
const _hoisted_15 = {
  slot: "file-name",
  "slot-scope": "{ names }"
}
const _hoisted_16 = {
  key: 0,
  class: "pt-2"
}
const _hoisted_17 = { class: "draggable-item" }
const _hoisted_18 = ["href", "alt", "target", "onClick"]

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_b_img = _resolveComponent("b-img")
  const _component_b_modal = _resolveComponent("b-modal")
  const _component_bk_button_icon = _resolveComponent("bk-button-icon")
  const _component_b_icon = _resolveComponent("b-icon")
  const _component_Draggable = _resolveComponent("Draggable")
  const _component_Container = _resolveComponent("Container")
  const _component_b_container = _resolveComponent("b-container")
  const _component_b_avatar = _resolveComponent("b-avatar")
  const _component_b_icon_pencil = _resolveComponent("b-icon-pencil")
  const _component_t = _resolveComponent("t")
  const _component_b_badge = _resolveComponent("b-badge")
  const _component_b_form_file = _resolveComponent("b-form-file")
  const _component_b_overlay = _resolveComponent("b-overlay")
  const _component_b_progress = _resolveComponent("b-progress")
  const _component_b_avatar_group = _resolveComponent("b-avatar-group")
  const _component_b_button = _resolveComponent("b-button")
  const _component_b_list_group_item = _resolveComponent("b-list-group-item")
  const _component_b_list_group = _resolveComponent("b-list-group")

  return (_openBlock(), _createElementBlock("div", null, [
    (_ctx.$props['for'] === 'view' && _ctx.$props['type'] === 'grid-justify')
      ? (_openBlock(), _createElementBlock("div", _hoisted_1, [
          _createVNode(_component_b_modal, {
            ref: "image-modal",
            "hide-footer": "",
            "hide-header": "",
            centered: "",
            size: "lg"
          }, {
            default: _withCtx(() => [
              _createElementVNode("button", {
                onClick: _cache[0] || (_cache[0] = $event => ($options.closeModal())),
                type: "button",
                "aria-label": "Close",
                class: "close"
              }, "×"),
              _createVNode(_component_b_img, {
                src: $data.activeImageSrc,
                text: $data.activeImageText
              }, null, 8 /* PROPS */, ["src", "text"])
            ]),
            _: 1 /* STABLE */
          }, 512 /* NEED_PATCH */),
          _createElementVNode("div", _hoisted_2, [
            _createElementVNode("ul", {
              class: "justified-image-grid",
              style: _normalizeStyle($options.cssProps)
            }, [
              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList($data.listFiles, (file, index) => {
                return (_openBlock(), _createElementBlock("li", {
                  key: file._id,
                  style: _normalizeStyle('--width: '+file.meta.width+'; --height: ' + file.meta.height + ';')
                }, [
                  _createVNode(_component_b_img, {
                    onClick: $event => ($options.openModal($event,file)),
                    src: $options.link(file,$props.fileFormat),
                    text: file.name
                  }, null, 8 /* PROPS */, ["onClick", "src", "text"])
                ], 4 /* STYLE */))
              }), 128 /* KEYED_FRAGMENT */))
            ], 4 /* STYLE */)
          ])
        ]))
      : (_openBlock(), _createElementBlock("div", _hoisted_3, [
          ($props.showFilesCards)
            ? (_openBlock(), _createElementBlock("div", {
                key: 0,
                onTouchend: _cache[4] || (_cache[4] = (...args) => ($options.fixActionRestriction && $options.fixActionRestriction(...args)))
              }, [
                (!$options.isFieldArray)
                  ? (_openBlock(), _createElementBlock("div", _hoisted_4, [
                      (_ctx.$props['for'] !== 'view')
                        ? (_openBlock(), _createElementBlock("div", _hoisted_5))
                        : _createCommentVNode("v-if", true),
                      ($data.listFiles[0])
                        ? (_openBlock(), _createElementBlock("a", {
                            key: 1,
                            href: $options.link($data.listFiles[0]),
                            alt: $data.listFiles[0].name,
                            target: $props.target,
                            onClick: _cache[1] || (_cache[1] = $event => ($options.openLink($options.link($data.listFiles[0]),$event)))
                          }, [
                            _createVNode(_component_b_img, {
                              thumbnail: "",
                              src: $options.link($data.listFiles[0],'thumbnail'),
                              alt: $data.listFiles[0].name,
                              class: "crop-height"
                            }, null, 8 /* PROPS */, ["src", "alt"])
                          ], 8 /* PROPS */, _hoisted_6))
                        : (_openBlock(), _createElementBlock("a", {
                            key: 2,
                            href: $options.staticLink(),
                            alt: "",
                            target: $props.target,
                            onClick: _cache[2] || (_cache[2] = $event => ($options.openLink($options.staticLink(),$event)))
                          }, [
                            _createVNode(_component_b_img, {
                              thumbnail: "",
                              src: $options.staticLink('thumbnail'),
                              alt: "",
                              class: "crop-height"
                            }, null, 8 /* PROPS */, ["src"])
                          ], 8 /* PROPS */, _hoisted_7)),
                      (_ctx.$props['for'] !== 'view' && $data.listFiles[0])
                        ? (_openBlock(), _createElementBlock("div", _hoisted_8, [
                            _createVNode(_component_bk_button_icon, {
                              onClick: _cache[3] || (_cache[3] = $event => ($options.onRemove($data.listFiles[0],_ctx.index))),
                              icon: "trash-fill",
                              variant: "danger",
                              class: "ml-auto mr-2"
                            })
                          ]))
                        : _createCommentVNode("v-if", true)
                    ]))
                  : (_openBlock(), _createBlock(_component_b_container, {
                      key: 1,
                      class: "p-2 bg-dark overflow-x"
                    }, {
                      default: _withCtx(() => [
                        _createVNode(_component_Container, {
                          onDrop: $options.onDrop,
                          orientation: "horizontal",
                          behaviour: "contain",
                          "drag-class": "card-ghost bg-info",
                          "drop-class": "card-ghost-drop"
                        }, {
                          default: _withCtx(() => [
                            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList($data.listFiles, (file, index) => {
                              return (_openBlock(), _createBlock(_component_Draggable, {
                                key: file._id,
                                class: "mt-2"
                              }, {
                                default: _withCtx(() => [
                                  _createElementVNode("div", _hoisted_9, [
                                    (_ctx.$props['for'] !== 'view' && $options.isFieldArray)
                                      ? (_openBlock(), _createElementBlock("div", _hoisted_10, [
                                          _createVNode(_component_b_icon, {
                                            class: "dragicon",
                                            icon: "arrows-move"
                                          })
                                        ]))
                                      : _createCommentVNode("v-if", true),
                                    (_ctx.$props['for'] !== 'view')
                                      ? (_openBlock(), _createElementBlock("div", _hoisted_11))
                                      : _createCommentVNode("v-if", true),
                                    _createElementVNode("a", {
                                      href: $options.link(file),
                                      alt: file.name,
                                      target: $props.target,
                                      onClick: $event => ($options.openLink($options.link(file),$event))
                                    }, [
                                      _createVNode(_component_b_img, {
                                        thumbnail: "",
                                        src: $options.link(file,'thumbnail'),
                                        alt: file.name,
                                        class: "crop-height"
                                      }, null, 8 /* PROPS */, ["src", "alt"])
                                    ], 8 /* PROPS */, _hoisted_12),
                                    (_ctx.$props['for'] !== 'view')
                                      ? (_openBlock(), _createElementBlock("div", _hoisted_13, [
                                          _createVNode(_component_bk_button_icon, {
                                            onClick: $event => ($options.onRemove(file,index)),
                                            icon: "trash-fill",
                                            variant: "danger",
                                            class: "ml-auto mr-2"
                                          }, null, 8 /* PROPS */, ["onClick"])
                                        ]))
                                      : _createCommentVNode("v-if", true)
                                  ])
                                ]),
                                _: 2 /* DYNAMIC */
                              }, 1024 /* DYNAMIC_SLOTS */))
                            }), 128 /* KEYED_FRAGMENT */))
                          ]),
                          _: 1 /* STABLE */
                        }, 8 /* PROPS */, ["onDrop"])
                      ]),
                      _: 1 /* STABLE */
                    }))
              ], 32 /* NEED_HYDRATION */))
            : _createCommentVNode("v-if", true),
          ($options.isAvatar && _ctx.$props['for'] === 'view')
            ? (_openBlock(), _createBlock(_component_b_avatar, _mergeProps({ key: 1 }, _ctx.$attrs, {
                src: $options.staticLink($props.fileFormat)
              }), _createSlots({ _: 2 /* DYNAMIC */ }, [
                _renderList(_ctx.$scopedSlots, (_, slot) => {
                  return {
                    name: slot,
                    fn: _withCtx((props) => [
                      _renderSlot(_ctx.$slots, slot, _normalizeProps(_guardReactiveProps(props)))
                    ])
                  }
                })
              ]), 1040 /* FULL_PROPS, DYNAMIC_SLOTS */, ["src"]))
            : _createCommentVNode("v-if", true),
          (_ctx.$props['for'] !== 'view')
            ? (_openBlock(), _createBlock(_component_b_overlay, {
                key: 2,
                show: $data.currentUpload
              }, {
                default: _withCtx(() => [
                  _createCommentVNode(" Avatar management .. "),
                  ($options.isAvatar)
                    ? (_openBlock(), _createElementBlock("a", {
                        key: 0,
                        href: "#",
                        onClick: _cache[5] || (_cache[5] = $event => (_ctx.$refs.inputFile.$el.firstElementChild.click()))
                      }, [
                        ($options.isAvatar)
                          ? (_openBlock(), _createBlock(_component_b_avatar, _mergeProps({ key: 0 }, _ctx.$attrs, {
                              src: $options.link($data.listFiles[0]) || $options.staticLink($props.fileFormat)
                            }), {
                              badge: _withCtx(() => [
                                _renderSlot(_ctx.$slots, "badge", _normalizeProps(_guardReactiveProps({$props: _ctx.$props})), () => [
                                  _createVNode(_component_b_icon_pencil)
                                ])
                              ]),
                              _: 3 /* FORWARDED */
                            }, 16 /* FULL_PROPS */, ["src"]))
                          : _createCommentVNode("v-if", true)
                      ]))
                    : _createCommentVNode("v-if", true),
                  _createCommentVNode(" .. avatar management "),
                  _withDirectives(_createVNode(_component_b_form_file, _mergeProps({ ref: "inputFile" }, _ctx.$attrs, {
                    modelValue: $data.inputFiles,
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => (($data.inputFiles) = $event)),
                    multiple: $options.isFieldArray,
                    accept: $props.accept,
                    placeholder: _ctx.placeholderTranslated,
                    onInput: $options.onFilesAdded,
                    class: "b-form-file"
                  }), {
                    default: _withCtx(() => [
                      _createElementVNode("template", _hoisted_14, [
                        _createVNode(_component_t, null, {
                          default: _withCtx(() => [
                            _createTextVNode(_toDisplayString($props.dropPlaceholder), 1 /* TEXT */)
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      _createElementVNode("template", _hoisted_15, [
                        _createVNode(_component_b_badge, { variant: "dark" }, {
                          default: _withCtx(() => [
                            _createTextVNode(_toDisplayString(_ctx.names[0]), 1 /* TEXT */)
                          ]),
                          _: 1 /* STABLE */
                        }),
                        (_ctx.names.length > 1)
                          ? (_openBlock(), _createBlock(_component_b_badge, {
                              key: 0,
                              variant: "dark",
                              class: "ml-1"
                            }, {
                              default: _withCtx(() => [
                                _createTextVNode(" + " + _toDisplayString(_ctx.names.length - 1) + " ", 1 /* TEXT */),
                                _createVNode(_component_t, null, {
                                  default: _withCtx(() => [...(_cache[9] || (_cache[9] = [
                                    _createTextVNode("app.file.more", -1 /* CACHED */)
                                  ]))]),
                                  _: 1 /* STABLE */
                                })
                              ]),
                              _: 1 /* STABLE */
                            }))
                          : _createCommentVNode("v-if", true)
                      ])
                    ]),
                    _: 1 /* STABLE */
                  }, 16 /* FULL_PROPS */, ["modelValue", "multiple", "accept", "placeholder", "onInput"]), [
                    [_vShow, !$options.isAvatar]
                  ])
                ]),
                _: 3 /* FORWARDED */
              }, 8 /* PROPS */, ["show"]))
            : _createCommentVNode("v-if", true),
          ($data.currentUpload)
            ? (_openBlock(), _createBlock(_component_b_progress, {
                key: 3,
                value: $data.progress,
                "show-progress": "",
                animated: "",
                striped: "",
                class: "mt-2 mb-2"
              }, null, 8 /* PROPS */, ["value"]))
            : _createCommentVNode("v-if", true),
          ($props.showFilesList)
            ? (_openBlock(), _createElementBlock("div", {
                key: 4,
                onTouchend: _cache[8] || (_cache[8] = (...args) => ($options.fixActionRestriction && $options.fixActionRestriction(...args)))
              }, [
                ($props.showFilesCounter)
                  ? (_openBlock(), _createBlock(_component_b_list_group, { key: 0 }, {
                      default: _withCtx(() => [
                        _createVNode(_component_b_list_group_item, null, {
                          default: _withCtx(() => [
                            _createElementVNode("div", null, [
                              _createVNode(_component_b_avatar_group, { size: "4rem" }, {
                                default: _withCtx(() => [
                                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList($data.listFiles, (file, index) => {
                                    return (_openBlock(), _createBlock(_component_b_avatar, {
                                      key: file._id,
                                      src: $options.link(file,'car'),
                                      text: file.ext
                                    }, null, 8 /* PROPS */, ["src", "text"]))
                                  }), 128 /* KEYED_FRAGMENT */)),
                                  _createVNode(_component_b_avatar, {
                                    variant: "primary",
                                    text: $data.listFiles.length.toString()
                                  }, null, 8 /* PROPS */, ["text"])
                                ]),
                                _: 1 /* STABLE */
                              })
                            ]),
                            ($data.listFiles.length > 0)
                              ? (_openBlock(), _createElementBlock("div", _hoisted_16, [
                                  _createVNode(_component_b_button, {
                                    class: _normalizeClass($data.visible ? 'collapsed': null),
                                    "aria-expanded": $data.visible ? 'true' : 'false',
                                    "aria-controls": "collapse-1",
                                    onClick: _cache[7] || (_cache[7] = $event => ($data.visible = !$data.visible))
                                  }, {
                                    default: _withCtx(() => [
                                      _createVNode(_component_t, null, {
                                        default: _withCtx(() => [...(_cache[10] || (_cache[10] = [
                                          _createTextVNode("app.file.manage", -1 /* CACHED */)
                                        ]))]),
                                        _: 1 /* STABLE */
                                      })
                                    ]),
                                    _: 1 /* STABLE */
                                  }, 8 /* PROPS */, ["class", "aria-expanded"])
                                ]))
                              : _createCommentVNode("v-if", true)
                          ]),
                          _: 1 /* STABLE */
                        })
                      ]),
                      _: 1 /* STABLE */
                    }))
                  : _createCommentVNode("v-if", true),
                _createVNode(_component_b_list_group, {
                  id: "collapse-1",
                  class: _normalizeClass($data.visible ? 'filesListShow': 'filesListHide')
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_Container, {
                      onDrop: $options.onDrop,
                      "drag-class": "card-ghost bg-info",
                      "drop-class": "card-ghost-drop"
                    }, {
                      default: _withCtx(() => [
                        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList($data.listFiles, (file, index) => {
                          return (_openBlock(), _createBlock(_component_Draggable, {
                            key: file._id,
                            class: "mt-2"
                          }, {
                            default: _withCtx(() => [
                              _createElementVNode("div", _hoisted_17, [
                                _createVNode(_component_b_list_group_item, { class: "d-flex align-items-center" }, {
                                  default: _withCtx(() => [
                                    _createVNode(_component_b_avatar, {
                                      src: $options.link(file,'thumbnail'),
                                      text: file.ext,
                                      class: "mr-3"
                                    }, null, 8 /* PROPS */, ["src", "text"]),
                                    _createElementVNode("a", {
                                      href: $options.link(file),
                                      alt: file.name,
                                      target: $props.target,
                                      onClick: $event => ($options.openLink($options.link(file),$event))
                                    }, _toDisplayString(file.name), 9 /* TEXT, PROPS */, _hoisted_18),
                                    _createVNode(_component_bk_button_icon, {
                                      onClick: $event => ($options.onRemove(file,index)),
                                      icon: "trash-fill",
                                      variant: "danger",
                                      class: "ml-auto mr-2"
                                    }, null, 8 /* PROPS */, ["onClick"]),
                                    ($options.isFieldArray)
                                      ? (_openBlock(), _createBlock(_component_b_icon, {
                                          key: 0,
                                          icon: "arrows-move"
                                        }))
                                      : _createCommentVNode("v-if", true)
                                  ]),
                                  _: 2 /* DYNAMIC */
                                }, 1024 /* DYNAMIC_SLOTS */)
                              ])
                            ]),
                            _: 2 /* DYNAMIC */
                          }, 1024 /* DYNAMIC_SLOTS */))
                        }), 128 /* KEYED_FRAGMENT */))
                      ]),
                      _: 1 /* STABLE */
                    }, 8 /* PROPS */, ["onDrop"])
                  ]),
                  _: 1 /* STABLE */
                }, 8 /* PROPS */, ["class"])
              ], 32 /* NEED_HYDRATION */))
            : _createCommentVNode("v-if", true)
        ]))
  ]))
}
_sfc_main.render = render;
