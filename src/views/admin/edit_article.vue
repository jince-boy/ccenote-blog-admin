<template>
  <el-form :model="state.form" :rules="state.rules" ref="form" label-position="top" label-width="100px"
  >
  <h2 id="page_title">{{state.page_title}}</h2>
  <div id="article_box">
    <div>
      <el-form-item prop="title" label="文章标题：">
        <el-input v-model="state.form.title" clearable placeholder="请输入文章标题"/>
      </el-form-item>
        <wangEditor @content="methods.content" :content="state.form.content" class="my-dark animate"></wangEditor>
      <el-form-item prop="keywords" label="文章关键字：">
        <el-input v-model="state.form.keywords" clearable placeholder="请输入文章关键字，使用英文逗号隔开"/>
      </el-form-item>
      <el-form-item prop="description" label="文章描述：">
        <el-input
            v-model="state.form.description"
            resize="none"
            type="textarea"
            placeholder="请输入文章描述"
        />
      </el-form-item>
      <el-form-item prop="tags" label="文章标签：">
        <el-select
            @change="methods.handleTagChange"
            v-model="state.form.tags"
            multiple
            filterable
            allow-create
            default-first-option
            :reserve-keyword="false"
            placeholder="请选择文章标签"
        >
          <el-option
              v-for="item in state.tags"
              :key="item.id"
              :label="item.name"
              :value="item.name"
          />
        </el-select>
      </el-form-item>
    </div>
    <div>
      <el-form-item label="封面图片：">
        <el-tooltip
            class="box-item"
            effect="dark"
            content="点击上传封面图片"
            placement="left"
        >
          <el-upload
              ref="upload"
              class="cover-uploader"
              action="#"
              :multiple="false"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="methods.fileChange"
          >
            <img v-if="state.cover!==''" :src="state.cover" class="cover" alt="cover">
            <el-icon class="cover-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
        </el-tooltip>
      </el-form-item>
      <el-form-item prop="date" label="发布时间：">
        <el-config-provider :locale="zhCn">
          <el-date-picker
              v-model="state.form.date"
              type="datetime"
              value-format="YYYY-MM-DD hh:mm:ss"
              placeholder="请选择发布时间"
          />
        </el-config-provider>

      </el-form-item>
      <el-form-item prop="category_id" label="文章分类：">
        <el-tree-select v-model="state.form.category_id" :data="state.category" :props="state.defaultProps" node-key="id" :render-after-expand="false" placeholder="请选择分类" />
      </el-form-item>
      <el-form-item prop="status" label="文章状态：">
        <el-radio-group v-model="state.form.status">
          <el-radio-button label="1">发布</el-radio-button>
          <el-radio-button label="0">草稿</el-radio-button>
        </el-radio-group>

      </el-form-item>
      <el-form-item prop="comment_status" label="评论状态：">
        <el-radio-group v-model="state.form.comment_status">
          <el-radio-button label="1">启用</el-radio-button>
          <el-radio-button label="0">禁用</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="is_top" label="文章置顶：">
        <el-switch
            size="large"
            v-model="state.form.is_top"
            class="mb-2"
            active-text="置顶"
            inactive-text="正常"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;margin-top:41px;" @click="methods.submitMethod">{{state.page_title}}</el-button>
      </el-form-item>
    </div>
  </div>
  </el-form>

</template>

<script>
import wangEditor from "../../components/wangEditor.vue";
import {getCurrentInstance, onMounted, reactive} from "vue";
import router from "../../router";
import {Plus} from '@element-plus/icons-vue'
import {getTagAll} from "../../api/tag";
import {ElMessage} from "element-plus";
import {getCategoryList} from "../../api/category";
import {addArticle, getArticle, updateArticle} from "../../api/article";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
export default {
  name: "edit_article",
  components:{
    wangEditor,
    Plus
  },
  setup(){
    const {proxy} = getCurrentInstance();
    const state=reactive({
      page_title:router.currentRoute.value.meta.title,
      tags:[],
      category:[],
      cover:'',
      defaultProps: {
        label: 'name'
      },
      form:{
        id:'',
        title:'',
        content:'',
        date:'',
        category_id:'',
        keywords:'',
        description:'',
        tags:[],
        status:'1',
        comment_status:'1',
        is_top:false,
        cover:''
      },
      rules:{
        title: [
          {required: true, message: '请输入文章标题', trigger: 'blur'},
          {min: 1, max: 191, message: '输入格式错误', trigger: 'blur'}
        ],
        content:[
          {required:true,message:'请输入文章内容',trigger:'blur'}
        ],
        date:[
          {required:true,message:'请输入发布时间',trigger:'blur'}
        ],
        category_id:[
          {required:true,message:'请选择文章分类',trigger:'blur'}
        ],
        keywords:[
          {min: 1, max: 191, message: '输入格式错误', trigger: 'blur'}
        ],
        description:[
          {min: 1, max: 191, message: '输入格式错误', trigger: 'blur'}
        ],
        tags:[
          {required:true,message:'请选择文章标签',trigger:'blur'}
        ],
        password:[
          {min: 6, max: 18, message: '密码长度为6-18位字符', trigger: 'blur'}
        ]
      }
    })
    const methods={
      content:(content)=>{
        state.form.content=content;
      },
      handleTagChange:(val)=>{
        state.form.tags=val;
        console.log(val);
      },
      fileChange(file, fileList) {
        fileList.splice(fileList.length - 2, fileList.length - 1);
        const type = file.raw.type === 'image/jpeg' || file.raw.type === 'image/jpg' || file.raw.type === 'image/png'|| file.raw.type === 'image/webp';
        const isLt2M = file.size / 1024 > 1 && file.size / 1024 < 5120
        if (!type) {
          ElMessage({
            message: '图片格式不正确!(只能包含jpg，png,webp)',
            type: 'error'
          })
          return;
        }
        if (!isLt2M) {
          ElMessage({
            message: '上传图片大小在10kb~5M之间!',
            type: 'error'
          })
          return;
        }
        if (type && isLt2M) {
          state.cover = URL.createObjectURL(file.raw);
          state.form.cover=file.raw;
        } else {
          fileList.splice(-1, 1);
        }
      },
      submitMethod:()=>{
        if(router.currentRoute.value.path==="/article/add"){
            methods.addArticle();
        }else if(router.currentRoute.value.path==="/article/update"){
            methods.updateArticle();
        }
      },
      toArticle:()=>{
        let toArticle=setInterval(function(){
          clearInterval(toArticle);
          router.replace('/article');
        },1000);
      },
      addArticle:()=>{
        proxy.$refs['form'].validate((valid) => {
          let formData=new FormData();
          formData.append('cover',state.form.cover);
          formData.append('title',state.form.title);
          formData.append('content',state.form.content);
          formData.append('date',state.form.date);
          formData.append('status',state.form.status);
          formData.append('comment_status',state.form.comment_status);
          formData.append('is_top',state.form.is_top?"1":"0");
          formData.append('keywords',state.form.keywords);
          formData.append('description',state.form.description);
          formData.append('category_id',state.form.category_id);
          state.form.tags.forEach((item,i)=>{
            formData.append(`tags[${i}]`,item);
          })
          if (valid){
            addArticle(formData).then(res=>{
              if(res.data.status){
                ElMessage({
                  message: res.data.message,
                  type: 'success'
                })
                methods.toArticle();
              }else{
                ElMessage({
                  message: res.data.error,
                  type: 'error'
                })
              }
            })
          }
        })
      },
      updateArticle:()=>{
        proxy.$refs['form'].validate((valid) => {
          let formData=new FormData();
          formData.append('id',state.form.id);
          formData.append('cover',state.form.cover);
          formData.append('title',state.form.title);
          formData.append('content',state.form.content);
          formData.append('date',state.form.date);
          formData.append('status',state.form.status);
          formData.append('comment_status',state.form.comment_status);
          formData.append('is_top',state.form.is_top?"1":"0");
          formData.append('keywords',state.form.keywords);
          formData.append('description',state.form.description);
          formData.append('category_id',state.form.category_id);
          state.form.tags.forEach((item,i)=>{
            formData.append(`tags[${i}]`,item);
          })
          if (valid){
            updateArticle(formData).then(res=>{
              if(res.data.status){
                ElMessage({
                  message: res.data.message,
                  type: 'success'
                })
                methods.toArticle();
                //路由跳转
              }else{
                ElMessage({
                  message: res.data.error,
                  type: 'error'
                })
              }
            })
          }
        })
      }
    }
    getTagAll().then(res=>{
      if(res.data.status){
        state.tags=res.data.data;
      }else{
        ElMessage({
          message: res.data.error,
          type: 'error'
        })
      }
    })
    getCategoryList().then(res=>{
      if(res.data.status){
        state.category=res.data.data;
      }else{
        ElMessage({
          message: res.data.error,
          type: 'error'
        })
      }
    })

      if(router.currentRoute.value.path==="/article/update"){
        getArticle({
          id:router.currentRoute.value.query.id
        }).then(res=>{
          if(res.data.status){
            state.form.id=res.data.data.id;
            state.form.title=res.data.data.title;
            state.form.content=res.data.data.content;
            state.form.keywords=res.data.data.keywords;
            state.form.tags=res.data.data.tags;
            state.form.description=res.data.data.description;
            state.form.is_top=res.data.data.is_top === "1";
            state.form.comment_status=res.data.data.comment_status;
            state.form.date=res.data.data.date;
            state.form.category_id=res.data.data.category_id;
            state.form.status=res.data.data.status;
            state.cover=res.data.data.cover;
          }else{
            ElMessage({
              message: res.data.error,
              type: 'error'
            })
          }
        })
      }

    return {
      state,
      methods,
      zhCn,
      router
    }
  }
}
</script>

<style lang="less">
#page_title{
  font-size:24px;
  padding-bottom: 12px;
  border-bottom:1px solid #ccc;
  margin-bottom: 12px;
}
#article_box{
  display: flex;
  justify-content: space-between;
  >div:nth-of-type(1){
    width:75%;
    margin-right:12px;
    .el-textarea__inner{
      height: 50px;
    }
  }
  >div:nth-of-type(2){
    width:25%;
    .el-date-editor{
      width:100% !important;
    }
  }
  .el-select{
    width: 100%;
  }
  .cover-uploader{
    width:100%;
  }
  .cover-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width:100%;
    height: 150px;

  }

  .cover-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .cover-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transition: .2s;
  }

  .cover-uploader-icon:hover {
    color: #fff;
    background: rgba(255, 255, 255, .5);
  }

  .cover {
    width: 100%;
    height: 100%;
    display: block;
  }
}

</style>