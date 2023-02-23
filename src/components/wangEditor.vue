<template>
  <div style="border:1px solid #ccc;margin-bottom: 18px;" id="wangEditor">
    <Toolbar style="border-bottom:1px solid #ccc;" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode">
    </Toolbar>
    <Editor
        class="wangEditorText"
        style="height: 350px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="methods.handleCreated"
        @onChange="methods.editor"
    />
  </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css'
import {Editor, Toolbar} from "@wangeditor/editor-for-vue";
import {onBeforeUnmount, ref, shallowRef, watch} from 'vue'
import {addArticleImg, addArticleVideo} from "../api/article";
import {ElMessage} from "element-plus";

export default {
  name: "wangEditor",
  components: {
    Editor,
    Toolbar
  },
  props: {
    content:{}
  },
  emits: ["content"],
  setup(props,context) {
    const editorRef = shallowRef();
    const toolbarConfig = {};
    const mode = 'default';
    const valueHtml = ref('');
    const editorConfig = {
      placeholder: '请输入内容...',
      MENU_CONF: {},
    };
    editorConfig.MENU_CONF['uploadImage'] = {
      async customUpload(file, insertFn) {                   // JS 语法
        const formData = new FormData();
        formData.append('img', file);
        addArticleImg(formData).then(res => {
          if (res.data.status) {
            insertFn(res.data.data.url, res.data.data.alt, res.data.data.href);
          } else {
            ElMessage({
              message: "上传失败",
              type: 'error'
            })
          }
        })
      }
    }
    editorConfig.MENU_CONF['uploadVideo'] = {
      async customUpload(file, insertFn) {
        const formData = new FormData();
        formData.append('video', file);
        addArticleVideo(formData).then(res=>{
          if(res.data.status){
            insertFn(res.data.data.url, res.data.data.poster)
          }else{
            ElMessage({
              message: "上传失败",
              type: 'error'
            })
          }
        })
      }
    }
    const methods = {
      handleCreated: (editor) => {
        editorRef.value = editor // 记录 editor 实例，重要！
      },
      editor:()=>{
        context.emit('content',valueHtml.value);
      }
    }
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return
      editor.destroy()
    })
    watch(props, value => {
      valueHtml.value = value.content;
    })
    return {
      editorRef,
      toolbarConfig,
      mode,
      valueHtml,
      editorConfig,
      methods
    }
  }
}
</script>

<style lang="less">
#wangEditor{
  z-index: 999;
  .w-e-bar{
    padding-bottom:2px;
  }
  .wangEditorText{
    overflow-y:visible !important;
  }
  .w-e-select-list{
    max-height: 220px !important;
  }
}
</style>