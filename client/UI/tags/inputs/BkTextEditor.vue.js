
import { Editor } from "@tiptap/core"
import { EditorContent } from "@tiptap/vue-3"
import StarterKit from "@tiptap/starter-kit"
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import ListItem from '@tiptap/extension-list-item'
const _sfc_main = {
  name: "BkTextEditor",
  emits: ['input','update:modelValue'],
  props: {
    // Keep `value` for backward compatibility with Vue2 and `v-model` usage
    value: {
      type: String,
      default: '',
    },
  },
  components: {
    EditorContent,
  },
  data() {
    return {
      editor: null,
      width: window?.innerWidth,
    }
  },
  computed: {
    isMobile() {
      return Meteor.isCordova || this.width < 600
    },
    editorToolbarClass() {
      return this.isMobile ? 'editor-toolbar mobile' : 'editor-toolbar';
    },
  },
  watch: {
    value(value) {
      // HTML
      const isSame = this.editor.getHTML() === value

      // JSON
      // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

      if (isSame) {
        return
      }

      this.editor.commands.setContent(value, false)
    },
  },
  created() {
    window.addEventListener("resize", this.onResize);
  },
  mounted() {
    // Create the editor instance with static imports (Vue 3)
    this.editor = new Editor({
      content: this.value,
      extensions: [
        StarterKit,
        // ListItem,
        Image.configure({
          inline: true,
          allowBase64: true,
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        TextStyle,
        Color.configure({
          types: [TextStyle.name, ListItem.name],
        }),
      ],
      onUpdate: () => {
        // HTML (Vue2 compatibility)
        this.$emit('input', this.editor.getHTML())
        // Vue3 style v-model compatibility
        this.$emit('update:modelValue', this.editor.getHTML())

        // JSON
        // this.$emit('input', this.editor.getJSON())
      },
    })
  },
  methods: {
    onResize(e) {
      this.width = window.innerWidth;
    },
  },
  unmounted() {
    this.editor && this.editor.destroy();
  },
  beforeDestroy() {
    // Vue 2 compatibility
    if (typeof this.unmounted === 'function') this.unmounted();
  },
}


export default _sfc_main;

import { resolveComponent as _resolveComponent, createVNode as _createVNode, normalizeClass as _normalizeClass, withCtx as _withCtx, createCommentVNode as _createCommentVNode, Teleport as _Teleport, openBlock as _openBlock, createBlock as _createBlock, createElementVNode as _createElementVNode, resolveDynamicComponent as _resolveDynamicComponent, createElementBlock as _createElementBlock } from "vue/dist/vue.runtime.esm-bundler.js"

const _hoisted_1 = {
  key: 0,
  class: "container"
}
const _hoisted_2 = { class: "control-group" }

function render(_ctx, _cache) {
  const _component_b_icon_type_bold = _resolveComponent("b-icon-type-bold")
  const _component_b_button = _resolveComponent("b-button")
  const _component_b_icon_type_italic = _resolveComponent("b-icon-type-italic")
  const _component_b_icon_type_strikethrough = _resolveComponent("b-icon-type-strikethrough")
  const _component_b_icon_code = _resolveComponent("b-icon-code")
  const _component_b_icon_x_lg = _resolveComponent("b-icon-x-lg")
  const _component_b_icon_type_h1 = _resolveComponent("b-icon-type-h1")
  const _component_b_icon_type_h2 = _resolveComponent("b-icon-type-h2")
  const _component_b_icon_type_h3 = _resolveComponent("b-icon-type-h3")
  const _component_b_icon_list_ul = _resolveComponent("b-icon-list-ul")
  const _component_b_icon_list_ol = _resolveComponent("b-icon-list-ol")
  const _component_b_icon_code_slash = _resolveComponent("b-icon-code-slash")
  const _component_b_icon_chat_square_quote = _resolveComponent("b-icon-chat-square-quote")
  const _component_b_icon_arrow90deg_left = _resolveComponent("b-icon-arrow90deg-left")
  const _component_b_icon_arrow90deg_right = _resolveComponent("b-icon-arrow90deg-right")
  const _component_b_button_group = _resolveComponent("b-button-group")

  return (_ctx.editor)
    ? (_openBlock(), _createElementBlock("div", _hoisted_1, [
        _createElementVNode("div", _hoisted_2, [
          (_openBlock(), _createBlock(_Teleport, {
            to: "body",
            disabled: !_ctx.isMobile
          }, [
            _createVNode(_component_b_button_group, {
              size: "sm",
              class: _normalizeClass(_ctx.editorToolbarClass)
            }, {
              default: _withCtx(() => [
                _createVNode(_component_b_button, {
                  onClick: _cache[0] || (_cache[0] = $event => (_ctx.editor.chain().focus().toggleBold().run())),
                  disabled: !_ctx.editor.can().chain().focus().toggleBold().run(),
                  class: _normalizeClass({ 'is-active': _ctx.editor.isActive('bold') })
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_b_icon_type_bold)
                  ]),
                  _: 1 /* STABLE */
                }, 8 /* PROPS */, ["disabled", "class"]),
                _createVNode(_component_b_button, {
                  onClick: _cache[1] || (_cache[1] = $event => (_ctx.editor.chain().focus().toggleItalic().run())),
                  disabled: !_ctx.editor.can().chain().focus().toggleItalic().run(),
                  class: _normalizeClass({ 'is-active': _ctx.editor.isActive('italic') })
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_b_icon_type_italic)
                  ]),
                  _: 1 /* STABLE */
                }, 8 /* PROPS */, ["disabled", "class"]),
                _createVNode(_component_b_button, {
                  onClick: _cache[2] || (_cache[2] = $event => (_ctx.editor.chain().focus().toggleStrike().run())),
                  disabled: !_ctx.editor.can().chain().focus().toggleStrike().run(),
                  class: _normalizeClass({ 'is-active': _ctx.editor.isActive('strike') })
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_b_icon_type_strikethrough)
                  ]),
                  _: 1 /* STABLE */
                }, 8 /* PROPS */, ["disabled", "class"]),
                _createVNode(_component_b_button, {
                  onClick: _cache[3] || (_cache[3] = $event => (_ctx.editor.chain().focus().toggleCode().run())),
                  disabled: !_ctx.editor.can().chain().focus().toggleCode().run(),
                  class: _normalizeClass({ 'is-active': _ctx.editor.isActive('code') })
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_b_icon_code)
                  ]),
                  _: 1 /* STABLE */
                }, 8 /* PROPS */, ["disabled", "class"]),
                _createVNode(_component_b_button, {
                  onClick: _cache[4] || (_cache[4] = $event => (_ctx.editor.chain().focus().unsetAllMarks().run()))
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_b_icon_x_lg)
                  ]),
                  _: 1 /* STABLE */
                }),
                _createCommentVNode("        <button @click=\"editor.chain().focus().clearNodes().run()\">"),
                _createCommentVNode("          Clear nodes"),
                _createCommentVNode("        </button>"),
                _createCommentVNode("        <button @click=\"editor.chain().focus().setParagraph().run()\" :class=\"{ 'is-active': editor.isActive('paragraph') }\">"),
                _createCommentVNode("          Paragraph"),
                _createCommentVNode("        </button>"),
                _createVNode(_component_b_button, {
                  onClick: _cache[5] || (_cache[5] = $event => (_ctx.editor.chain().focus().toggleHeading({ level: 1 }).run())),
                  class: _normalizeClass({ 'is-active': _ctx.editor.isActive('heading', { level: 1 }) })
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_b_icon_type_h1)
                  ]),
                  _: 1 /* STABLE */
                }, 8 /* PROPS */, ["class"]),
                _createVNode(_component_b_button, {
                  onClick: _cache[6] || (_cache[6] = $event => (_ctx.editor.chain().focus().toggleHeading({ level: 2 }).run())),
                  class: _normalizeClass({ 'is-active': _ctx.editor.isActive('heading', { level: 2 }) })
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_b_icon_type_h2)
                  ]),
                  _: 1 /* STABLE */
                }, 8 /* PROPS */, ["class"]),
                _createVNode(_component_b_button, {
                  onClick: _cache[7] || (_cache[7] = $event => (_ctx.editor.chain().focus().toggleHeading({ level: 3 }).run())),
                  class: _normalizeClass({ 'is-active': _ctx.editor.isActive('heading', { level: 3 }) })
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_b_icon_type_h3)
                  ]),
                  _: 1 /* STABLE */
                }, 8 /* PROPS */, ["class"]),
                _createCommentVNode("        <button @click=\"editor.chain().focus().toggleHeading({ level: 4 }).run()\" :class=\"{ 'is-active': editor.isActive('heading', { level: 4 }) }\">"),
                _createCommentVNode("          H4"),
                _createCommentVNode("        </button>"),
                _createCommentVNode("        <button @click=\"editor.chain().focus().toggleHeading({ level: 5 }).run()\" :class=\"{ 'is-active': editor.isActive('heading', { level: 5 }) }\">"),
                _createCommentVNode("          H5"),
                _createCommentVNode("        </button>"),
                _createCommentVNode("        <button @click=\"editor.chain().focus().toggleHeading({ level: 6 }).run()\" :class=\"{ 'is-active': editor.isActive('heading', { level: 6 }) }\">"),
                _createCommentVNode("          H6"),
                _createCommentVNode("        </button>"),
                _createVNode(_component_b_button, {
                  onClick: _cache[8] || (_cache[8] = $event => (_ctx.editor.chain().focus().toggleBulletList().run())),
                  class: _normalizeClass({ 'is-active': _ctx.editor.isActive('bulletList') })
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_b_icon_list_ul)
                  ]),
                  _: 1 /* STABLE */
                }, 8 /* PROPS */, ["class"]),
                _createVNode(_component_b_button, {
                  onClick: _cache[9] || (_cache[9] = $event => (_ctx.editor.chain().focus().toggleOrderedList().run())),
                  class: _normalizeClass({ 'is-active': _ctx.editor.isActive('orderedList') })
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_b_icon_list_ol)
                  ]),
                  _: 1 /* STABLE */
                }, 8 /* PROPS */, ["class"]),
                _createVNode(_component_b_button, {
                  onClick: _cache[10] || (_cache[10] = $event => (_ctx.editor.chain().focus().toggleCodeBlock().run())),
                  class: _normalizeClass({ 'is-active': _ctx.editor.isActive('codeBlock') })
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_b_icon_code_slash)
                  ]),
                  _: 1 /* STABLE */
                }, 8 /* PROPS */, ["class"]),
                _createVNode(_component_b_button, {
                  onClick: _cache[11] || (_cache[11] = $event => (_ctx.editor.chain().focus().toggleBlockquote().run())),
                  class: _normalizeClass({ 'is-active': _ctx.editor.isActive('blockquote') })
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_b_icon_chat_square_quote)
                  ]),
                  _: 1 /* STABLE */
                }, 8 /* PROPS */, ["class"]),
                _createCommentVNode("        <button @click=\"editor.chain().focus().setHorizontalRule().run()\">"),
                _createCommentVNode("          Horizontal rule"),
                _createCommentVNode("        </button>"),
                _createCommentVNode("        <button @click=\"editor.chain().focus().setHardBreak().run()\">"),
                _createCommentVNode("          Hard break"),
                _createCommentVNode("        </button>"),
                _createVNode(_component_b_button, {
                  onClick: _cache[12] || (_cache[12] = $event => (_ctx.editor.chain().focus().undo().run())),
                  disabled: !_ctx.editor.can().chain().focus().undo().run()
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_b_icon_arrow90deg_left)
                  ]),
                  _: 1 /* STABLE */
                }, 8 /* PROPS */, ["disabled"]),
                _createVNode(_component_b_button, {
                  onClick: _cache[13] || (_cache[13] = $event => (_ctx.editor.chain().focus().redo().run())),
                  disabled: !_ctx.editor.can().chain().focus().redo().run()
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_b_icon_arrow90deg_right)
                  ]),
                  _: 1 /* STABLE */
                }, 8 /* PROPS */, ["disabled"]),
                _createCommentVNode("        <button @click=\"editor.chain().focus().setColor('#958DF1').run()\" :class=\"{ 'is-active': editor.isActive('textStyle', { color: '#958DF1' }) }\">"),
                _createCommentVNode("          Purple"),
                _createCommentVNode("        </button>")
              ]),
              _: 1 /* STABLE */
            }, 8 /* PROPS */, ["class"])
          ], 8 /* PROPS */, ["disabled"]))
        ]),
        (_openBlock(), _createBlock(_resolveDynamicComponent('EditorContent'), {
          editor: _ctx.editor,
          class: "tiptap"
        }, null, 8 /* PROPS */, ["editor"]))
      ]))
    : _createCommentVNode("v-if", true)
}
_sfc_main.render = render;
