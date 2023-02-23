<template>
  <div class="flex dialog">
    <el-button type="primary" :icon="Plus" @click="methods.openMethod('add')">新建</el-button>
    <el-button type="danger" :icon="Delete" @click="methods.delete(true)">删除</el-button>
    <el-dialog v-model="state.dialogFormVisible" :title="state.dialogTitle" :before-close="methods.handleClose"
               destroy-on-close draggable>
      <el-form :model="state.form" :rules="state.rules" ref="form" label-position="right" label-width="100px"
      >
        <el-form-item prop="username" label="用户名：">
          <el-input v-model="state.form.username" clearable/>
        </el-form-item>
        <el-form-item prop="password" label="密码：">
          <el-input v-model="state.form.password" type="password" show-password clearable/>
        </el-form-item>
        <el-form-item prop="email" label="邮箱：">
          <el-input v-model="state.form.email" clearable/>
        </el-form-item>
        <el-form-item prop="name" label="名称：">
          <el-input v-model="state.form.name" clearable/>
        </el-form-item>
        <el-form-item label="个人链接：" prop="url">
          <el-input v-model="state.form.url" placeholder="请输入个人链接" clearable/>
        </el-form-item>
        <el-form-item label="个人简介：" prop="profile">
          <el-input
              v-model="state.form.profile"
              type="textarea"
              placeholder="请输入个人简介"
              clearable
          />
        </el-form-item>
        <el-form-item prop="role_id" label="角色名称：">
          <el-select v-model="state.form.role_id" placeholder="请选择角色" style="width:100%;">
            <el-option
                v-for="item in state.roleData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="用户状态：">
          <el-radio-group v-model="state.form.status">
            <el-radio-button label="1">启用</el-radio-button>
            <el-radio-button label="0">禁用</el-radio-button>
          </el-radio-group>
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
  <div class="table">
    <el-table
        ref="table"
        :data="state.tableData"
        v-loading="state.loading"
        table-layout="auto"
        @selection-change="methods.select"
        row-key="id"
    >
      <el-table-column type="selection"/>
      <el-table-column prop="avatar" align="center" label="头像">
        <template #default="scope">
          <el-tooltip
              effect="dark"
              content="点击修改用户头像"
              placement="right"
          >
            <el-avatar shape="square" :size="35"
                       :src="axios.defaults.baseURL+'/images?username='+scope.row.username+'&type=back'+'&spec=120'"
                       @click="methods.openAvatarDialog(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名"/>
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="email" label="邮箱"/>
      <el-table-column prop="role" label="角色" sortable/>
      <el-table-column prop="status" label="状态" align="center" sortable>
        <template #default="scope">
          {{ scope.row.status === "0" ? "禁用" : "启用" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" :icon="Edit" @click="methods.openMethod('update',scope.row.id)"/>
          <el-button type="danger" :icon="Delete" @click="methods.delete(false,scope.row.id)"/>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="state.avatarVisible" title="修改头像" :before-close="methods.avatarHandleClose"
               destroy-on-close draggable>
      <el-form label-position="top" :model="state.form" :rules="state.rules">
        <el-form-item>
          <el-tooltip
              class="box-item"
              effect="dark"
              content="点击上传头像"
              placement="right"
          >
            <el-upload
                ref="upload"
                class="avatar-uploader"
                action="#"
                :multiple="false"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="methods.fileChange"
                :http-request="methods.updateAvatar"
            >
              <img :src="state.avatar" class="avatar" alt="avatar">
              <el-icon class="avatar-uploader-icon">
                <Plus/>
              </el-icon>
            </el-upload>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <p style="text-align:center">上传头像之后页面没有改变的话请清除浏览器缓存</p>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="methods.submitUpload"
        >修改头像</el-button
        >
      </span>
      </template>
    </el-dialog>
  </div>
  <div class="page">
    <el-pagination
        v-model:currentPage="state.currentPage"
        :hide-on-single-page="state.last_page===1"
        :page-size="state.per_page"
        background
        layout="prev, pager, next"
        :total="state.total"
        @current-change="methods.handleCurrentChange"
    />
  </div>
</template>

<script>
import {reactive, getCurrentInstance} from "vue";
import {Plus, Search, Refresh, Delete, Edit} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from "element-plus";
import {getRoleList} from "../../api/role";
import {
  addAdminUser,
  deleteAdminUser,
  getAdminUser,
  getAdminUserList,
  updateAdminUser,
  updateAdminUserAvatar
} from "../../api/admin";
import axios from "axios";
export default {
  name: "admin",
  components: {
    Plus
  },
  setup() {
    const {proxy} = getCurrentInstance();
    const state = reactive({
      tableData: [],
      loading: true,
      dialogFormVisible: false,
      avatarVisible: false,
      dialogTitle: '添加管理员',
      method: 'add',
      currentPage: 0,
      total: 0,
      per_page: 0,
      last_page: 0,
      roleData: [],
      deleteArray: [],
      avatar: '',
      form: {
        id: '',
        username: '',
        password: '',
        email: '',
        name: '',
        url: '',
        profile: '',
        role_id: '',
        status: '1'
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 6, max: 255, message: '用户名输入格式错误', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 8, max: 255, message: '密码必须在8位数以上', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur'}
        ],
        name: [
          {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
        ],
        url: [
          {type: 'url', message: '请输入正确的url格式', trigger: 'blur'}
        ],
        profile: [
          {min: 1, max: 300, message: '长度在 1 到 300 个字符', trigger: 'blur'}
        ],
        role_id: [
          {required: true, message: '请选择角色', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择状态', trigger: 'blur'},
        ]
      },
    });
    const methods = {
      handleCurrentChange: (val) => {
        getLists(val);
      },
      handleClose: () => {
        ElMessageBox.confirm('确定要关闭吗？', {confirmButtonText: '确定', cancelButtonText: '取消'}).then(() => {
          state.dialogFormVisible = false;
          proxy.$refs['form'].resetFields();
          state.form.permissionIds = [];
        }).catch(() => {
        })
      },
      avatarHandleClose: () => {
        ElMessageBox.confirm('确定要关闭吗？', {confirmButtonText: '确定', cancelButtonText: '取消'}).then(() => {
          state.avatarVisible = false;
          state.form.id = '';
        }).catch(() => {
        })
      },
      select: (val) => {
        state.deleteArray = [];
        val.forEach(item => {
          state.deleteArray.push(item.id);
        })
      },
      openMethod: (method, id) => {
        if (method === 'add') {
          state.method = 'add';
          state.dialogFormVisible = true;
          state.dialogTitle = '添加管理员';
        } else if (method === 'update') {
          state.method = 'update';
          state.form.id = id;
          state.dialogFormVisible = true;
          state.dialogTitle = '修改管理员';
          getAdminUser({
            id: state.form.id
          }).then(res => {
            if (res.data.status) {
              state.form.username = res.data.data.username;
              state.form.email = res.data.data.email;
              state.form.name = res.data.data.name;
              state.form.url=res.data.data.url;
              state.form.profile=res.data.data.profile;
              state.form.role_id = res.data.data.role.id;
              state.form.status = res.data.data.status;
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
      add: () => {
        proxy.$refs['form'].validate(valid => {
          if (valid) {
            addAdminUser({
              username: state.form.username,
              password: state.form.password,
              email: state.form.email,
              name: state.form.name,
              url:state.form.url,
              profile:state.form.profile,
              role_id: state.form.role_id,
              status: state.form.status
            }).then(res => {
              if (res.data.status) {
                ElMessage({
                  message: res.data.message,
                  type: 'success'
                })
                getLists();
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
            updateAdminUser({
              id: state.form.id,
              username: state.form.username,
              password: state.form.password,
              email: state.form.email,
              name: state.form.name,
              url:state.form.url,
              profile:state.form.profile,
              role_id: state.form.role_id,
              status: state.form.status
            }).then(res => {
              if (res.data.status) {
                ElMessage({
                  message: res.data.message,
                  type: 'success'
                })
                getLists();
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
      delete: (isMultiple, ids) => {
        ElMessageBox.confirm('确定要删除吗？', {confirmButtonText: '确定', cancelButtonText: '取消'}).then(() => {
          if (isMultiple) {
            if (state.deleteArray.length === 0) {
              ElMessage({
                message: '请选择要删除的用户',
                type: 'error'
              })
              return false;
            }
          } else {
            state.deleteArray = [];
            state.deleteArray.push(ids);
          }
          deleteAdminUser({
            ids: state.deleteArray
          }).then(res => {
            if (res.data.status) {
              ElMessage({
                message: res.data.message,
                type: 'success'
              })
              getLists();
            } else {
              ElMessage({
                message: res.data.error,
                type: 'error'
              })
            }
          })
        }).catch(() => {
        })
      },
      openAvatarDialog: (row) => {
        state.form.id = row.id;
        state.avatar = row.avatar;
        state.avatarVisible = true;
      },
      fileChange(file, fileList) {
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
          state.avatar = URL.createObjectURL(file.raw);
        } else {
          fileList.splice(-1, 1);
        }
      },
      updateAvatar(param) {
        const formData = new FormData()
        formData.append('avatar', param.file);
        formData.append('id', state.form.id);
        updateAdminUserAvatar(formData).then(res => {
          if (res.data.status) {
            ElMessage({
              message: "上传成功",
              type: 'success'
            })
            state.avatarVisible = false;
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
    getRoleList().then(res => {
      if (res.data.status) {
        state.roleData = res.data.data;
      } else {
        ElMessage({
          message: res.data.error,
          type: 'error'
        })
      }
    })
    function getLists(page) {
      state.loading = true;
      getAdminUserList({
        page: page
      }).then(res => {
        if (res.data.status) {
          state.loading = false;
          state.tableData = res.data.data.data;
          state.currentPage = res.data.data.current_page;
          state.total = res.data.data.total;
          state.per_page = res.data.data.per_page;
          state.last_page = res.data.data.last_page;
        } else {
          ElMessage({
            message: res.data.error,
            type: 'error'
          })
        }
      })
    }
    getLists();
    return {
      state,
      methods,
      Plus,
      Search,
      Refresh,
      Delete,
      Edit,
      axios
    }
  }
}
</script>

<style lang="less">
.search {
  .el-form {
    display: flex;

    .el-form-item {
      margin-right: 12px;
    }

    .el-input__inner {
      width: 250px;
    }
  }
}

.page {
  .el-pagination {
    justify-content: right;
    margin-top: 30px;
    margin-bottom: 12px;
  }
}

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

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 200px;
  height: 200px;

}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transition: .2s;
}

.avatar-uploader-icon:hover {
  color: #fff;
  background: rgba(255, 255, 255, .5);
}

.avatar {
  width: 100%;
  height: 100%;
  display: block;
}
</style>