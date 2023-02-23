<template>
  <div class="flex dialog">
    <el-button type="primary" :icon="Plus" @click="methods.openMethod('add')">新建</el-button>
    <el-button type="danger" :icon="Delete" @click="methods.delete(true)">删除</el-button>
    <el-dialog v-model="state.dialogFormVisible" :title="state.dialogTitle" :before-close="methods.handleClose"
               destroy-on-close draggable>
      <el-form :model="state.form" :rules="state.rules" ref="form" label-position="right" label-width="100px"
      >
        <el-form-item prop="name" label="标签名：">
          <el-input v-model="state.form.name" clearable/>
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
      <el-table-column prop="name" label="标签名"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" :icon="Edit" @click="methods.openMethod('update',scope.row.id)"/>
          <el-button type="danger" :icon="Delete" @click="methods.delete(false,scope.row.id)"/>
        </template>
      </el-table-column>
    </el-table>
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
import {addTag, deleteTag, getTagData, getTagList, updateTag} from '../../api/tag';
export default {
  name: "tag",
  setup(){
    const {proxy} = getCurrentInstance();
    const state = reactive({
      tableData: [],
      loading: true,
      dialogFormVisible: false,
      dialogTitle: '添加标签',
      method: 'add',
      currentPage: 0,
      total: 0,
      per_page: 0,
      last_page: 0,
      deleteArray: [],
      form: {
        id: '',
        name: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 1, max: 255, message: '用户名输入格式错误', trigger: 'blur'}
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
          state.dialogTitle = '添加标签';
        } else if (method === 'update') {
          state.method = 'update';
          state.form.id = id;
          state.dialogFormVisible = true;
          state.dialogTitle = '修改标签';
          getTagData({
            id: state.form.id
          }).then(res => {
            if (res.data.status) {
              state.form.name = res.data.data.name;
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
            addTag({
              name: state.form.name,
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
            updateTag({
              id: state.form.id,
              name: state.form.name,
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
          deleteTag({
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
    }
    function getLists(page) {
      state.loading = true;
      getTagList({
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
  .el-dialog {
    width: 25%;

    .el-form-item__content {
      justify-content: center;
    }
  }
}
</style>