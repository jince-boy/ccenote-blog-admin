<template>

  <div class="flex dialog">
    <el-button type="primary" :icon="Plus" @click="methods.openMethod('add')">新建</el-button>
    <el-button type="danger" :icon="Delete" @click="methods.delete(true)">删除</el-button>
    <el-dialog v-model="state.dialogFormVisible" :title="state.dialogTitle" :before-close="methods.handleClose"
               destroy-on-close draggable>
      <el-form :model="state.form" :rules="state.rules" ref="form" label-position="right" label-width="100px"
      >
        <el-form-item prop="name" label="角色名称：">
          <el-input v-model="state.form.name" clearable/>
        </el-form-item>
        <el-form-item prop="description" label="角色描述：">
          <el-input v-model="state.form.description" clearable/>
        </el-form-item>
        <el-form-item prop="permissionIds" label="角色权限：">
          <el-tree-select v-model="state.form.permissionIds" :data="state.permissionData" multiple default-expand-all
                          show-checkbox check-strictly node-key="id"
                          :props="state.defaultProps" style="width:100%;" placeholder="请选择角色权限"
                          clearable/>
        </el-form-item>
        <el-form-item prop="status" label="权限状态：">
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
        @selection-change="methods.select"
        row-key="id"
    >
      <el-table-column type="selection"/>
      <el-table-column prop="name" label="角色名称" sortable/>
      <el-table-column prop="description" label="角色描述" align="center"/>
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
  </div>
</template>

<script>
import {Plus, Search, Refresh, Delete, Edit} from '@element-plus/icons-vue'
import {reactive, getCurrentInstance,} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus';
import {getRoleList, addRole, getRole, updateRole, deleteRole} from "../../api/role";
import {getList} from "../../api/permission";

export default {
  name: "role",
  setup() {
    const {proxy} = getCurrentInstance();
    const state = reactive({
      tableData: [],
      permissionData: [],
      dialogFormVisible: false,
      dialogTitle: '添加角色',
      method: 'add',
      loading: true,
      currentPage: 0,
      total: 0,
      per_page: 0,
      last_page: 0,
      deleteArray: [],
      defaultProps: {
        label: 'name'
      },
      form: {
        id: '',
        name: '',
        description: '',
        status: '1',
        permissionIds: [],
      },
      rules: {
        name: [
          {required: true, message: '请输入权限名称', trigger: 'blur'},
          {min: 1, max: 20, message: '输入格式错误', trigger: 'blur'}
        ],
        description: [
          {min: 1, max: 255, message: '输入字符个数应在1到255之间', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择状态', trigger: 'blur'},
        ],
        permissionIds: [
          {required: true, message: '请选择角色权限', trigger: 'blur'},
        ],
      },
    });
    const methods = {
      handleClose: () => {
        ElMessageBox.confirm('确定要关闭吗？', {confirmButtonText: '确定', cancelButtonText: '取消'}).then(() => {
          state.dialogFormVisible = false;
          proxy.$refs['form'].resetFields();
          state.form.permissionIds = [];
        }).catch(() => {
        })
      },
      openMethod: (method, id) => {
        if (method === 'add') {
          state.method = 'add';
          state.dialogFormVisible = true;
          state.dialogTitle = '添加角色';
        } else if (method === 'update') {
          state.method = 'update';
          state.form.id = id;
          state.dialogFormVisible = true;
          state.dialogTitle = '修改角色';
          getRole({
            id: state.form.id
          }).then(res => {
            if (res.data.status) {
              state.form.name = res.data.data.name;
              state.form.description = res.data.data.description;
              state.form.status = res.data.data.status;
              state.form.permissionIds = res.data.data.permissionIds;
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
      select: (val) => {
        state.deleteArray = [];
        val.forEach(item=>{
          state.deleteArray.push(item.id);
        })
      },
      add: () => {
        proxy.$refs['form'].validate(valid => {
          if (valid) {
            addRole({
              name: state.form.name,
              description: state.form.description,
              status: state.form.status,
              permissionIds: state.form.permissionIds
            }).then(res => {
              if (res.data.status) {
                ElMessage({
                  message: res.data.message,
                  type: 'success'
                })
                getLists()
                state.dialogFormVisible = false;
                state.form.permissionIds = [];
                proxy.$refs['form'].resetFields();
              } else {
                ElMessage({
                  'message': res.data.error,
                  'type': 'error'
                })
              }
            })
          }
        })
      },
      update: () => {
        proxy.$refs['form'].validate(valid => {
          if (valid) {
            updateRole({
              id: state.form.id,
              name: state.form.name,
              description: state.form.description,
              status: state.form.status,
              permissionIds: state.form.permissionIds
            }).then(res => {
              if (res.data.status) {
                ElMessage({
                  message: res.data.message,
                  type: 'success'
                })
                getLists();
                state.dialogFormVisible = false;
                state.form.permissionIds = [];
                proxy.$refs['form'].resetFields();
              } else {
                ElMessage({
                  'message': res.data.error,
                  'type': 'error'
                })
              }
            })
          }
        })
      },
      delete: (isMultiple, ids) => {
        ElMessageBox.confirm('确定要退出吗？', {confirmButtonText: '确定', cancelButtonText: '取消'}).then(() => {
          if (isMultiple) {
            if (state.deleteArray.length === 0) {
              ElMessage({
                message: '请选择要删除的角色',
                type: 'error'
              })
              return false;
            }
          }else{
            state.deleteArray = [];
            state.deleteArray.push(ids);
          }
          deleteRole({
            ids:state.deleteArray
          }).then(res=>{
            if(res.data.status){
              ElMessage({
                message: res.data.message,
                type: 'success'
              })
              getLists();
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
    getList().then(res => {
      if (res.data.status) {
        state.permissionData = res.data.data;
      } else {
        ElMessage({
          'message': res.data.error,
          'type': 'error'
        })
      }
    })

    function getLists() {
      state.loading = true;
      getRoleList().then(res => {
        if (res.data.status) {
          state.loading = false;
          state.tableData = res.data.data;
        } else {
          ElMessage({
            'message': res.data.error,
            'type': 'error'
          })
        }
      })
    }

    getLists();
    return {
      state,
      Search,
      Refresh,
      Plus,
      Delete,
      Edit,
      methods,
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
}
</style>