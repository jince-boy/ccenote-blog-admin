<template>
  <div id="file">
    <el-dialog v-model="state.dialogFormVisible" title="上传文件" :before-close="methods.handleClose"
               destroy-on-close draggable>
      <el-form :model="state.form" :rules="state.rules" ref="form" label-position="right" label-width="100px">
        <el-upload
            class="upload-demo"
            drag
            ref="upload"
            action="#"
            :multiple="false"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="methods.fileChange"
            :http-request="methods.updateAvatar"
        >
         <el-icon class="el-icon--upload"><upload-filled/></el-icon>
          <div class="el-upload__text">
            将文件拖到此处或单击上传,不允许多文件上传<br>
            只能上传mp4,avi,jpeg,jpg,png,webp,zip,rar,doc,docx,xls,xlsx,txt,md文件
          </div>
          <template #tip>
            <div class="el-upload__tip">
              <p><span>上传列表：</span>{{state.uploadList}}</p>
            </div>
          </template>
        </el-upload>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="methods.submitUpload()">上传</el-button>
      </span>
      </template>
    </el-dialog>
    <el-tabs>
      <el-tab-pane label="文章资源">
        <el-checkbox-group v-model="state.ArticleFile.checkedCities"
                           @change="methods.ArticleFile.handleCheckedCitiesChange">
          <el-row :gutter="6">
            <el-col
                v-for="(item,index) in state.ArticleFile.ArticleFileList"
                :key="index"
                :span="4"
            >
              <el-checkbox :label="item.path">
                <el-card shadow="hover">
                  <img v-if="methods.extension(item.extension)"
                       :src="state.ArticleFile.path+item.path"
                       alt="image"
                  />
                  <img v-else src="../../assets/images/file.jpeg" alt="file">
                  <div>
                    <p><span>文件大小：</span>{{ item.size }}</p>
                    <p><span>上传时间：</span>{{ item.time }}</p>
                    <div>
                      <el-button type="primary" size="small" @click="methods.copy(item.type,item.path)">复制</el-button>
                      <el-button type="danger" size="small" @click="methods.deleteFiles('article',[item.path])">删除</el-button>
                    </div>
                  </div>
                </el-card>
              </el-checkbox>
            </el-col>
          </el-row>
        </el-checkbox-group>
        <div class="page">
          <div class="flex dialog">
            <el-checkbox
                border
                v-model="state.ArticleFile.checkAll"
                :indeterminate="state.ArticleFile.isIndeterminate"
                @change="methods.ArticleFile.handleCheckAllChange"
                class="checkAll"
            >全选
            </el-checkbox>
            <el-button type="danger" :icon="Delete" @click="methods.deleteFiles('article',state.ArticleFile.checkedCities)">删除</el-button>
          </div>
          <el-pagination
              v-model:currentPage="state.ArticleFile.currentPage"
              :hide-on-single-page="state.ArticleFile.last_page===1"
              :page-size="state.ArticleFile.per_page"
              background
              layout="prev, pager, next"
              :total="state.ArticleFile.total"
              @current-change="methods.ArticleFile.ArticleHandleCurrentChange"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="文件资源">
        <div class="flex dialog">
          <el-button type="primary" :icon="UploadFilled" @click="state.dialogFormVisible=true">上传</el-button>
        </div>
        <el-checkbox-group v-model="state.File.checkedCities" @change="methods.File.handleCheckedCitiesChange">
          <el-row :gutter="6">
            <el-col
                v-for="(item,index) in state.File.FileList"
                :key="index"
                :span="4"
            >
              <el-checkbox :label="item.path">
                <el-card shadow="hover">
                  <img v-if="methods.extension(item.extension)"
                       :src="state.File.path+item.path"
                       alt="image"
                  />
                  <img v-else src="../../assets/images/file.jpeg" alt="file">
                  <div>
                    <p><span>文件大小：</span>{{ item.size }}</p>
                    <p><span>上传时间：</span>{{ item.time }}</p>
                    <div>
                      <el-button type="primary" size="small" @click="methods.copy(item.type,item.path)">复制</el-button>
                      <el-button type="danger" size="small" @click="methods.deleteFiles('file',[item.path])">删除</el-button>
                    </div>
                  </div>
                </el-card>
              </el-checkbox>
            </el-col>
          </el-row>
        </el-checkbox-group>
        <div class="page">
          <div class="flex dialog">
            <el-checkbox
                border
                v-model="state.File.checkAll"
                :indeterminate="state.File.isIndeterminate"
                @change="methods.File.handleCheckAllChange"
                class="checkAll"
            >全选
            </el-checkbox>
            <el-button type="danger" :icon="Delete" @click="methods.deleteFiles('file',state.File.checkedCities)">删除</el-button>
          </div>
          <el-pagination
              v-model:currentPage="state.File.currentPage"
              :hide-on-single-page="state.File.last_page===1"
              :page-size="state.File.per_page"
              background
              layout="prev, pager, next"
              :total="state.File.total"
              @current-change="methods.File.ArticleHandleCurrentChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
    <input type="text" id="copyText">
  </div>
</template>

<script>
import {getCurrentInstance, reactive} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {deleteFile, getFileList, uploadFile} from "../../api/file";
import {Delete, UploadFilled} from '@element-plus/icons-vue';
import {updateUserAvatar} from "../../api/user";

export default {
  name: "file",
  components:{
    UploadFilled
  },
  setup() {
    const {proxy} = getCurrentInstance();
    const state = reactive({
      ArticleFile: {
        path: '',
        checkAll: false,
        checkedCities: [],
        isIndeterminate: false,
        ArticleFileList: [],
        ArticleCities: [],
        currentPage: 0,
        total: 0,
        per_page: 0,
        last_page: 0,
      },
      File: {
        path: '',
        checkAll: false,
        checkedCities: [],
        isIndeterminate: false,
        FileList: [],
        FileCities: [],
        currentPage: 0,
        total: 0,
        per_page: 0,
        last_page: 0,
      },
      loading: true,
      dialogFormVisible: false,
      uploadList:'',
      form: {
        id: '',
        content: '',
        parent_id: '',
        article_id: ''
      },
      rules: {
        content: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
        ]
      },
    });
    const methods = {
      handleClose: () => {
        ElMessageBox.confirm('确定要关闭吗？', {confirmButtonText: '确定', cancelButtonText: '取消'}).then(() => {
          state.dialogFormVisible = false;
          proxy.$refs['form'].resetFields();
        }).catch(() => {
        })
      },
      ArticleFile: {
        ArticleHandleCurrentChange: (val) => {
          getFileLists('article', val);
        },
        handleCheckAllChange: (val) => {
          state.ArticleFile.checkedCities = val ? state.ArticleFile.ArticleCities : [];
          state.ArticleFile.isIndeterminate = false;
        },
        handleCheckedCitiesChange: (val) => {
          const checkedCount = val.length
          state.ArticleFile.checkAll = checkedCount === state.ArticleFile.ArticleCities.length
          state.ArticleFile.isIndeterminate = checkedCount > 0 && checkedCount < state.ArticleFile.ArticleCities.length
        }
      },
      File: {
        ArticleHandleCurrentChange: (val) => {
          getFileLists('file', val);
        },
        handleCheckAllChange: (val) => {
          state.File.checkedCities = val ? state.File.FileCities : [];
          state.File.isIndeterminate = false;
        },
        handleCheckedCitiesChange: (val) => {
          const checkedCount = val.length
          state.File.checkAll = checkedCount === state.File.FileCities.length
          state.File.isIndeterminate = checkedCount > 0 && checkedCount < state.File.FileCities.length
        }
      },
      deleteFiles:(type,names)=>{
        deleteFile({
          names:names,
          type:type
        }).then(res=>{
          if(res.data.status){
            ElMessage({
              message: res.data.message,
              type: 'success'
            })
            if(type==='article'){
              state.ArticleFile.isIndeterminate=false;
            }else{
              state.File.isIndeterminate=false;
            }
            getFileLists(type,1);
          }else{
            ElMessage({
              message: res.data.error,
              type: 'error'
            })
          }
        })
      },
      extension: (val) => {
        return val === 'jpg' || val === 'png' || val === 'jpeg' || val === 'webp';
      },
      copy: (type, path) => {
        if (type === 'article') {
          document.getElementById('copyText').value = state.ArticleFile.path + path;
        } else {
          document.getElementById('copyText').value = state.File.path + path;
        }
        document.getElementById('copyText').select();
        document.execCommand("copy"); // 执行浏览器复制命令
        ElMessage({
          message: "复制成功",
          type: 'success'
        })
      },
      fileChange(file) {
        let FileExt = file.name.replace(/.+\./, "");
        if (['mp4','avi','jpeg','jpg','png','webp','zip','rar','doc','docx','xls','xlsx','txt','md'].indexOf(FileExt.toLowerCase()) === -1){
          ElMessage({
            message: '文件格式不正确!',
            type: 'error'
          })
        }else{
          state.uploadList=file.name;
        }
      },
      updateAvatar(file) {
        const formData = new FormData()
        formData.append('file', file.file);
        uploadFile(formData).then(res => {
          if (res.data.status) {
            ElMessage({
              message: "上传成功",
              type: 'success'
            })
            state.dialogFormVisible=false;
            getFileLists('file',1);
          } else {
            ElMessage({
              message: "上传失败",
              type: 'error'
            })
          }
        })
      },
      submitUpload() {
        proxy.$refs['upload'].submit();
      },
    }

    async function getFileLists(type, page) {
      await getFileList({
        page: page,
        type: type
      }).then(res => {
        if (res.data.status) {
          state.loading = false;
          if (type === 'article') {
            state.ArticleFile.ArticleFileList = res.data.data.data;
            state.ArticleFile.path = res.data.data.url;
            state.ArticleFile.currentPage = res.data.data.current_page;
            state.ArticleFile.total = res.data.data.total;
            state.ArticleFile.per_page = res.data.data.per_page;
            state.ArticleFile.last_page = res.data.data.last_page;
          } else {
            state.File.FileList = res.data.data.data;
            state.File.path = res.data.data.url;
            state.File.currentPage = res.data.data.current_page;
            state.File.total = res.data.data.total;
            state.File.per_page = res.data.data.per_page;
            state.File.last_page = res.data.data.last_page;
          }

        } else {
          ElMessage({
            message: res.data.error,
            type: 'error'
          })
        }
      })
      if (type === 'article') {
        state.ArticleFile.ArticleFileList.forEach(item => {
          state.ArticleFile.ArticleCities.push(item.path);
        })
      } else {
        state.File.FileList.forEach(item => {
          state.File.FileCities.push(item.path);
        })
      }
    }
    getFileLists('article', 1);
    getFileLists('file', 1);
    return {
      state,
      methods,
      Delete,
      UploadFilled
    }
  }
}
</script>

<style lang="less">
#copyText {
  position: fixed;
  top: 0;
  left: -9999px;
}

#file {
  .el-upload__tip{
    line-height: 30px;
    font-size:16px;
  }
  .page {
    display: flex !important;
    justify-content: space-between;

    .flex {
      button {
        margin-left: 12px;
      }
    }

    .el-pagination {
      margin: 0 !important;
      justify-content: right;
    }
  }

  .el-row {
    margin: 12px 0;
    .el-col{
      margin-bottom:12px;
    }
    .el-checkbox {
      position: relative;
      height: auto;
      width:100%;
      .el-checkbox__input {
        position: absolute;
        top: 16px;
        right: 16px;
      }

      .el-checkbox__label {
        padding: 0;
        width:100%;
      }
    }
  }
}

.checkAll {
  vertical-align: middle;

  .el-checkbox__label {
    height: 20px;
    line-height: 23px;
  }
}

.el-card__body {
  padding: 12px;

  img {
    width: 100%;
    height: 120px;
  }

  > div {
    font-size: 12px;

    p {
      margin: 6px 0;
    }

    div {
      display: flex;
      justify-content: space-between;

      .el-button {
        width: 48%;
      }
    }
  }
}

</style>