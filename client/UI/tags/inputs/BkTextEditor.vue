<template>
  <div v-if="editor" class="container">
    <div class="control-group">
      <b-button-group size="sm" class="editor-toolbar">
        <b-button @click="editor.chain().focus().toggleBold().run()" :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
          <b-icon-type-bold/>
        </b-button>
        <b-button @click="editor.chain().focus().toggleItalic().run()" :disabled="!editor.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
          <b-icon-type-italic/>
        </b-button>
        <b-button @click="editor.chain().focus().toggleStrike().run()" :disabled="!editor.can().chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
          <b-icon-type-strikethrough/>
        </b-button>
        <b-button @click="editor.chain().focus().toggleCode().run()" :disabled="!editor.can().chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }">
          <b-icon-code/>
        </b-button>
        <b-button @click="editor.chain().focus().unsetAllMarks().run()">
          <b-icon-x-lg/>
        </b-button>
<!--        <button @click="editor.chain().focus().clearNodes().run()">-->
<!--          Clear nodes-->
<!--        </button>-->
<!--        <button @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">-->
<!--          Paragraph-->
<!--        </button>-->
        <b-button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
          <b-icon-type-h1/>
        </b-button>
        <b-button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
          <b-icon-type-h2/>
        </b-button>
        <b-button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
          <b-icon-type-h3/>
        </b-button>
<!--        <button @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">-->
<!--          H4-->
<!--        </button>-->
<!--        <button @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">-->
<!--          H5-->
<!--        </button>-->
<!--        <button @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">-->
<!--          H6-->
<!--        </button>-->
        <b-button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
          <b-icon-list-ul/>
        </b-button>
        <b-button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
          <b-icon-list-ol/>
        </b-button>
        <b-button @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">
          <b-icon-code-slash/>
        </b-button>
        <b-button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
          <b-icon-chat-square-quote/>
        </b-button>
<!--        <button @click="editor.chain().focus().setHorizontalRule().run()">-->
<!--          Horizontal rule-->
<!--        </button>-->
<!--        <button @click="editor.chain().focus().setHardBreak().run()">-->
<!--          Hard break-->
<!--        </button>-->
        <b-button @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()">
          <b-icon-arrow90deg-left/>
        </b-button>
        <b-button @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()">
          <b-icon-arrow90deg-right/>
        </b-button>
<!--        <button @click="editor.chain().focus().setColor('#958DF1').run()" :class="{ 'is-active': editor.isActive('textStyle', { color: '#958DF1' }) }">-->
<!--          Purple-->
<!--        </button>-->
      </b-button-group>
    </div>
    <component :is="editorComponentLoader" :editor="editor" class="tiptap"/>
  </div>
</template>

<script>
import StarterKit from "@tiptap/starter-kit"
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import ListItem from '@tiptap/extension-list-item'


export default {
  name: "BkTextEditor",
  props: {
    value: {
      type: String,
      default: 'Hi there',
    },
  },
  components: {
    // quillEditor,
    EditorContent: () => import("@tiptap/vue-2").then(m => m.EditorContent),
  },
  data() {
    return {
      editorComponentLoader: "EditorContent",
      editor: null,
    }
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
  mounted() {
    import("@tiptap/vue-2").then(({ Editor }) => {
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
          // HTML
          this.$emit('input', this.editor.getHTML())

          // JSON
          // this.$emit('input', this.editor.getJSON())
        },
      })
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  },
}
</script>

<style scoped>
.editor-toolbar {
  display: flex;
  flex-wrap: nowrap;
  background: #f8f9fa;
  border-radius: 0.5rem 0.5rem 0 0;
  padding: 0.3rem 0.3rem;
  box-shadow: 0 2px 8px #dee2e6;
  position: sticky;
  top: 0;
  z-index: 10;
  justify-content: flex-start;
  align-items: center;
  /*margin-bottom: 1rem;*/
}

.editor-toolbar button {
  background: none;
  border: none;
  color: #444;
  /*font-size: 1.2rem;*/
  /*padding: 0.4rem 0.6rem;*/
  border-radius: 0.3rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.editor-toolbar button.is-active,
.editor-toolbar button:focus {
  background: #e0e0ff;
  color: #5a3ec8;
}

.editor-toolbar button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .editor-toolbar {
    position: fixed;
    bottom: 0;
    top: auto;
    left: 0;
    right: 0;
    border-radius: 0;
    margin-bottom: 0;
    box-shadow: 0 -2px 8px rgba(0,0,0,0.08);
    justify-content: space-around;
    padding: 0.6rem 0.2rem;
  }
}
.tiptap {
  border: 1px solid #f8f9fa;
  box-shadow: 0 2px 8px #dee2e6;
  border-radius: 0 0 0.5rem 0.5rem;
  padding: 1rem;
  background: #fff;
  min-height: 100px;
}
</style>
  