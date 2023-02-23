<template>
  <div class="flex dialog">
    <el-button type="primary" :icon="Plus" @click="methods.openMethod('add')">新建</el-button>
    <el-dialog v-model="state.dialogFormVisible" :title="state.dialogTitle" :before-close="methods.handleClose"
               destroy-on-close draggable>
      <el-form :model="state.form" :rules="state.rules" ref="form" label-position="right" label-width="100px"
      >
        <el-form-item label="合作伙伴图片：">
          <el-tooltip
              class="box-item"
              effect="dark"
              content="点击上传合作伙伴图片"
              placement="right"
          >
            <el-upload
                ref="addPartner"
                class="partner-uploader"
                action="#"
                :multiple="false"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="methods.fileChange"
            >
              <el-image :src="state.form.partner">
                <template #error>
                  <div class="image-slot">
                    加载失败
                  </div>
                </template>
              </el-image>
              <el-icon class="partner-uploader-icon">
                <Plus/>
              </el-icon>
            </el-upload>
          </el-tooltip>
        </el-form-item>
        <el-form-item prop="title" label="合作伙伴名称：">
          <el-input v-model="state.form.title" clearable/>
        </el-form-item>
        <el-form-item prop="url" label="合作伙伴链接：">
          <el-input v-model="state.form.url" clearable/>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="methods.submitMethod"
        >{{ state.dialogTitle }}</el-button
        >
      </span>
      </template>
    </el-dialog>
  </div>
  <div class="table partnerTable">
    <el-table
        ref="table"
        :data="state.tableData"
        v-loading="state.loading"
        table-layout="auto"
        row-key="id"
    >
      <el-table-column prop="img" align="center" label="友情链接图片">
        <template #default="scope">
          <el-tooltip
              v-if="scope.row.path!==null"
              effect="dark"
              content="友情链接图片"
              placement="right"
          >
            <el-avatar shape="square" :size="35" :src="scope.row.path" @click="methods.partnerDialog(scope.row.path)"/>
          </el-tooltip>
          <el-avatar v-else :size="35" shape="square">
            <img
                src="../../assets/images/partner.jpeg"
            />
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="友情链接名称"/>
      <el-table-column prop="url" label="友情链接地址"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" :icon="Edit" @click="methods.openMethod('update',scope.row.id)"/>
          <el-button type="danger" :icon="Delete" @click="methods.delete(scope.row.id)"/>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="state.partnerDialog" title="合作伙伴图片">
      <img :src="state.path">
    </el-dialog>
  </div>
</template>

<script>
import {reactive, getCurrentInstance} from "vue";
import {Plus, Search, Refresh, Delete, Edit} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from "element-plus";
import {addPartner, updatePartner, getPartnerList, getPartner, deletePartner} from "../../api/partner";
import {deleteBanner} from "../../api/banner";
export default {
  name: "partner",
  components:{
    Plus
  },
  setup(){
    const {proxy} = getCurrentInstance();
    const state = reactive({
      tableData: [],
      loading: true,
      partnerDialog:false,
      dialogFormVisible: false,
      dialogTitle: '添加抽奖',
      method: 'add',
      path:'',
      form: {
        id: '',
        url: '',
        partner: '',
        partnerContent: '',
        title: ''
      },
      rules: {
        url: [
          {type:'url', message: '请输入正确的网址格式', trigger: 'blur'},
        ],
        title: [
          {type:'string', message: '请输入正确的字符串格式', trigger: 'blur'},
        ]
      },
    });
    const methods={
      handleClose: () => {
        ElMessageBox.confirm('确定要关闭吗？', {confirmButtonText: '确定', cancelButtonText: '取消'}).then(() => {
          state.dialogFormVisible = false;
          state.form.partner='';
          state.form.partnerContent='';
          proxy.$refs['form'].resetFields();
        }).catch(() => {
        })
      },
      partnerDialog:(val)=>{
        state.partnerDialog=true;
        state.path=val;
      },
      openMethod: (method, id) => {
        if (method === 'add') {
          state.method = 'add';
          state.dialogFormVisible = true;
          state.dialogTitle = '添加合作伙伴';
        } else if (method === 'update') {
          state.method = 'update';
          state.form.id = id;
          state.dialogFormVisible = true;
          state.dialogTitle = '修改合作伙伴';
          getPartner({
            id:state.form.id
          }).then(res=>{
            if (res.data.status) {
              state.form.partner=res.data.data.path;
              state.form.url=res.data.data.url;
              state.form.title=res.data.data.title;
            }else {
              ElMessage({
                message: res.data.error,
                type: 'error'
              })
            }
          })
        }
      },
      submitMethod: () => {
        if (state.method === 'add') {
          methods.add();
        } else if (state.method === 'update') {
          methods.update();
        }
      },
      fileChange: (file, fileList) => {
        fileList.splice(fileList.length - 2, fileList.length - 1);
        const type = file.raw.type === 'image/jpeg' || file.raw.type === 'image/jpg' || file.raw.type === 'image/png' || file.raw.type === 'image/webp';
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
          state.form.partner = URL.createObjectURL(file.raw);
          state.form.partnerContent = file;
        } else {
          fileList.splice(-1, 1);
        }
      },
      add: () => {
        proxy.$refs['form'].validate(valid => {
          if (valid) {
            const formData = new FormData();
            if(state.form.partnerContent!==""){
              formData.append('partner', state.form.partnerContent.raw);
            }
            formData.append('url',state.form.url);
            formData.append('title', state.form.title);
            addPartner(formData).then(res => {
              if (res.data.status) {
                ElMessage({
                  message: res.data.message,
                  type: 'success'
                })
                getList();
                state.form.partner='';
                state.form.partnerContent='';
                state.dialogFormVisible = false;
                proxy.$refs['form'].resetFields();
              } else {
                ElMessage({
                  message: res.data.error,
                  type: 'error'
                })
              }
            })
          }
        })
      },
      update:()=>{
        proxy.$refs['form'].validate(valid => {
          if (valid) {
            const formData = new FormData();
            if(state.form.partnerContent!==""){
              formData.append('partner', state.form.partnerContent.raw);
            }
            formData.append('id',state.form.id);
            formData.append('url', state.form.url);
            formData.append('title', state.form.title);
            updatePartner(formData).then(res => {
              if (res.data.status) {
                ElMessage({
                  message: res.data.message,
                  type: 'success'
                })
                getList();
                state.form.partner='';
                state.form.partnerContent='';
                state.dialogFormVisible = false;
                proxy.$refs['form'].resetFields();
              } else {
                ElMessage({
                  message: res.data.error,
                  type: 'error'
                })
              }
            })
          }
        })
      },
      delete:(id)=>{
        ElMessageBox.confirm('确定要删除吗？', {confirmButtonText: '确定', cancelButtonText: '取消'}).then(() => {
          deletePartner(
              {id:id}
          ).then(res=>{
            if(res.data.status){
              ElMessage({
                message: res.data.message,
                type: 'success'
              })
              getList();
            }else{
              ElMessage({
                message: res.data.error,
                type: 'error'
              })
            }
          })
        }).catch(() => {
        })
      }
    }
    function getList(){
      getPartnerList().then(res=>{
        if(res.data.status){
          state.loading = false;
          state.tableData = res.data.data;
        }else {
          ElMessage({
            message: res.data.error,
            type: 'error'
          })
        }
      })
    }
    getList();
    return {
      state,
      methods,
      Plus,
      Search,
      Refresh,
      Delete,
      Edit
    }
  }
}
</script>

<style lang="less">
.table {
  margin-top: 18px;

  .el-avatar {
    cursor: pointer;
  }

  .el-dialog {
    width: 25%;

    .el-form-item__content {
      justify-content: center;
    }
  }
}

.partner-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 148px;
  height: 148px;
}

.partner-uploader .el-upload:hover {
  border-color: #409EFF;
}

.partner-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transition: .2s;
}

.partner-uploader-icon:hover {
  color: #fff;
  background: rgba(255, 255, 255, .5);
}
.partnerTable .el-dialog{
  width:300px !important;
  img{
    width:100%;
  }
}
</style>