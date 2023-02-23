<template>
  <div class="flex dialog">
    <el-button type="primary" :icon="Plus" @click="methods.openMethod('add')">新建</el-button>
    <el-dialog v-model="state.dialogFormVisible" :title="state.dialogTitle" :before-close="methods.handleClose"
               destroy-on-close draggable>
      <el-form :model="state.form" :rules="state.rules" ref="form" label-position="right" label-width="100px"
      >
        <el-form-item label="banner图片：">
          <el-tooltip
              class="box-item"
              effect="dark"
              content="点击上传Banner图片"
              placement="right"
          >
            <el-upload
                ref="addBanner"
                class="banner-uploader"
                action="#"
                :multiple="false"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="methods.fileChange"
            >
              <el-image :src="state.form.banner">
                <template #error>
                  <div class="image-slot">
                    加载失败
                  </div>
                </template>
              </el-image>
              <el-icon class="banner-uploader-icon">
                <Plus/>
              </el-icon>
            </el-upload>
          </el-tooltip>
        </el-form-item>
        <el-form-item prop="url" label="banner链接：">
          <el-input v-model="state.form.url" clearable/>
        </el-form-item>
        <el-form-item prop="description" label="banner描述：">
          <el-input v-model="state.form.description" clearable/>
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
  <div class="table bannerTable">
    <el-table
        ref="table"
        :data="state.tableData"
        v-loading="state.loading"
        table-layout="auto"
        row-key="id"
    >
      <el-table-column prop="img" align="center" label="Banner图片">
        <template #default="scope">
          <el-tooltip
              effect="dark"
              content="奖品图片"
              placement="right"
          >
            <el-avatar shape="square" :size="35" :src="scope.row.path" @click="methods.bannerDialog(scope.row.path)"/>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="banner链接"/>
      <el-table-column prop="description" label="banner描述"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" :icon="Edit" @click="methods.openMethod('update',scope.row.id)"/>
          <el-button type="danger" :icon="Delete" @click="methods.delete(scope.row.id)"/>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="state.bannerDialog" title="banner图片">
      <img :src="state.path">
    </el-dialog>
  </div>
</template>

<script>
import {reactive, getCurrentInstance} from "vue";
import {Plus, Search, Refresh, Delete, Edit} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from "element-plus";
import {getBannerList, getBanner, addBanner, updateBanner, deleteBanner} from "../../api/banner";

export default {
  name: "banner",
  components: {
    Plus
  },
  setup() {
    const {proxy} = getCurrentInstance();
    const state = reactive({
      tableData: [],
      loading: true,
      bannerDialog: false,
      dialogFormVisible: false,
      avatarVisible: false,
      dialogTitle: '添加抽奖',
      method: 'add',
      path: '',
      form: {
        id: '',
        url: '',
        banner: '',
        bannerContent: '',
        description: ''
      },
      rules: {
        url: [
          {type: 'url', message: '请输入正确的网址格式', trigger: 'blur'},
        ],
        description: [
          {type: 'string', message: '请输入正确的字符串格式', trigger: 'blur'},
        ]
      },
    });
    const methods = {
      handleClose: () => {
        ElMessageBox.confirm('确定要关闭吗？', {confirmButtonText: '确定', cancelButtonText: '取消'}).then(() => {
          state.dialogFormVisible = false;
          state.form.banner = '';
          state.form.bannerContent = '';
          proxy.$refs['form'].resetFields();
        }).catch(() => {
        })
      },
      bannerDialog: (val) => {
        state.bannerDialog = true;
        state.path = val;
      },
      openMethod: (method, id) => {
        if (method === 'add') {
          state.method = 'add';
          state.dialogFormVisible = true;
          state.dialogTitle = '添加Banner';
        } else if (method === 'update') {
          state.method = 'update';
          state.form.id = id;
          state.dialogFormVisible = true;
          state.dialogTitle = '修改Banner';
          getBanner({
            id: state.form.id
          }).then(res => {
            if (res.data.status) {
              state.form.banner = res.data.data.path;
              state.form.url = res.data.data.url;
              state.form.description = res.data.data.description;
            } else {
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
          state.form.banner = URL.createObjectURL(file.raw);
          state.form.bannerContent = file;
        } else {
          fileList.splice(-1, 1);
        }
      },
      add: () => {
        proxy.$refs['form'].validate(valid => {
          if (valid) {
            const formData = new FormData();
            formData.append('img', state.form.bannerContent.raw);
            formData.append('url', state.form.url);
            formData.append('description', state.form.description);
            addBanner(formData).then(res => {
              if (res.data.status) {
                ElMessage({
                  message: res.data.message,
                  type: 'success'
                })
                getList();
                state.form.banner = '';
                state.form.bannerContent = '';
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
      update: () => {
        proxy.$refs['form'].validate(valid => {
          if (valid) {
            const formData = new FormData();
            if (state.form.bannerContent !== "") {
              formData.append('img', state.form.bannerContent.raw);
            }
            formData.append('id', state.form.id);
            formData.append('url', state.form.url=state.form.url===null?'':state.form.url);
            formData.append('description', state.form.description=state.form.description===null?'':state.form.description);
            updateBanner(formData).then(res => {
              if (res.data.status) {
                ElMessage({
                  message: res.data.message,
                  type: 'success'
                })
                getList();
                state.form.banner = '';
                state.form.bannerContent = '';
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
      delete: (id) => {
        ElMessageBox.confirm('确定要删除吗？', {confirmButtonText: '确定', cancelButtonText: '取消'}).then(() => {
          deleteBanner(
              {id: id}
          ).then(res => {
            if (res.data.status) {
              ElMessage({
                message: res.data.message,
                type: 'success'
              })
              getList();
            } else {
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

    function getList() {
      getBannerList().then(res => {
        if (res.data.status) {
          state.loading = false;
          state.tableData = res.data.data;
        } else {
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

.banner-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 148px;
  height: 148px;
}

.banner-uploader .el-upload:hover {
  border-color: #409EFF;
}

.banner-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transition: .2s;
}

.banner-uploader-icon:hover {
  color: #fff;
  background: rgba(255, 255, 255, .5);
}

.bannerTable .el-dialog {
  width: 60% !important;

  img {
    width: 100%;
  }
}
</style>