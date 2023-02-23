<template>
  <div class="flex dialog">
    <el-button type="primary" :icon="Plus" @click="methods.openMethod('add')">新建</el-button>
    <el-dialog v-model="state.dialogFormVisible" :title="state.dialogTitle" :before-close="methods.handleClose"
               destroy-on-close draggable>
      <el-form :model="state.form" :rules="state.rules" ref="form" label-position="right" label-width="100px"
      >
        <el-form-item prop="is_menu" label="是否菜单：">
          <el-radio-group v-model="state.form.is_menu">
            <el-radio-button label="0">否</el-radio-button>
            <el-radio-button label="1">是</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="name" label="分类名称：">
          <el-input v-model="state.form.name" clearable/>
        </el-form-item>
        <el-form-item prop="description" label="分类描述：">
          <el-input v-model="state.form.description" clearable/>
        </el-form-item>
        <el-form-item label="菜单图标：" v-if="state.form.is_menu==='1'">
          <el-popover trigger="click" :width="800" v-model:visible="state.iconVisible">
            <template #reference>
              <el-input v-model="state.form.icon" disabled class="iconInput" title="点击选择图标">
                <template #prepend>
                  <i :class="['iconfont',state.form.icon?state.form.icon:'icon-bi']"></i>
                  <!--            <el-button :icon="Search" />-->
                </template>
              </el-input>
            </template>
            <template #default>
              <ul class="iconBox">
                <li v-for="item in iconList" :title="item" @click="methods.icon(item)">
                  <i :class="['iconfont',item]"></i>
                </li>
              </ul>
            </template>
          </el-popover>
        </el-form-item>
        <el-form-item prop="order" label="顺序标识：">
          <el-input v-model="state.form.order" clearable/>
        </el-form-item>
        <el-form-item prop="parent_id" label="父级节点：">
          <el-tree-select v-model="state.form.parent_id" :data="state.tableData" check-strictly node-key="id"
                          :props="state.defaultProps" style="width:100%;" placeholder="可以为空，默认为根节点"
                          clearable/>
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
        :data="state.tableData"
        v-loading="state.loading"
        row-key="id"
    >
      <el-table-column prop="name" label="分类名称" sortable/>
      <el-table-column prop="description" label="分类描述" align="center"/>
      <el-table-column prop="is_menu" label="是否菜单" sortable align="center">
        <template #default="scope">
          {{ scope.row.is_menu === "0" ? "否" : "是" }}
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="图标" align="center">
        <template #default="scope">
          <i :class="['iconfont',scope.row.icon]"></i>
        </template>
      </el-table-column>
      <el-table-column prop="order" label="顺序标识" sortable align="center"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" :icon="Edit" @click="methods.openMethod('update',scope.row.id)"/>
          <el-button type="danger" :icon="Delete" @click="methods.delete(scope.row.id)"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {Plus, Search, Refresh, Delete, Edit} from '@element-plus/icons-vue'
import {reactive, getCurrentInstance,} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus';
import iconList from "../../utils/icon";
import {addCategory, deleteCategory, getCategory, getCategoryList, updateCategory} from "../../api/category";
export default {
  name: "category",
  setup() {
    const {proxy} = getCurrentInstance();
    const state = reactive({
      tableData: [],
      loading: true,
      dialogFormVisible: false,
      dialogTitle: '添加分类',
      method:'add',
      iconVisible:false,
      defaultProps: {
        label: 'name'
      },
      form: {
        id: '',
        name: '',
        is_menu: "0",
        icon:'',
        order: '',
        description: '',
        parent_id: '',
      },
      rules: {
        name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'},
          {min: 1, max: 20, message: '输入格式错误', trigger: 'blur'}
        ],
        is_menu: [
          {required: true, message: '请选择是否为菜单', trigger: 'blur'},
        ],
        icon: [
          {min: 1, max: 191, message: '输入字符个数应在1到191之间', trigger: 'blur'}
        ],
        order: [
          {min: 0, max: 20, message: '输入格式错误', trigger: 'blur'}
        ],
        description: [
          {min: 1, max: 255, message: '输入字符个数应在1到255之间', trigger: 'blur'}
        ],
      },
    });
    const methods = {
      icon: (item) => {
        state.form.icon = item;
        state.iconVisible = false;
      },
      handleClose: () => {
        ElMessageBox.confirm('确定要关闭吗？', {confirmButtonText: '确定', cancelButtonText: '取消'}).then(() => {
          state.dialogFormVisible = false;
          proxy.$refs['form'].resetFields();
        }).catch(() => {
        })
      },
      openMethod: (method, id) => {
        if (method === 'add') {
          state.method='add';
          state.dialogFormVisible = true;
          state.dialogTitle = '添加分类';
        } else if (method === 'update') {
          state.method='update';
          state.form.id = id;
          state.dialogFormVisible = true;
          state.dialogTitle = '修改分类';
          getCategory({
            id: state.form.id,
          }).then(res => {
            if(res.data.status){
              state.form.name = res.data.data.name;
              state.form.is_menu = res.data.data.is_menu;
              state.form.description = res.data.data.description;
              state.form.icon=res.data.data.icon;
              state.form.parent_id = res.data.data.parent_id;
              if(res.data.data.order!==null){
                state.form.order = res.data.data.order.toString();
              }
            }else{
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
        } else if (state.method  === 'update') {
          methods.update();
        }
      },
      add: () => {
        proxy.$refs['form'].validate(valid=>{
          if(valid){
            addCategory({
              name: state.form.name,
              is_menu: state.form.is_menu,
              order: state.form.order,
              icon:state.form.icon,
              description: state.form.description,
              parent_id: state.form.parent_id
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
        proxy.$refs['form'].validate(valid=>{
          if(valid){
            updateCategory({
              id: state.form.id,
              name: state.form.name,
              is_menu: state.form.is_menu,
              order: state.form.order,
              icon:state.form.icon,
              description: state.form.description,
              parent_id: state.form.parent_id
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
      delete:(id)=>{
        ElMessageBox.confirm('确定要删除吗？', {confirmButtonText: '确定', cancelButtonText: '取消'}).then(() => {
          deleteCategory({
            ids:[id]
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
    function getLists(){
      state.loading = true;
      getCategoryList().then(res => {
        if(res.data.status){
          state.tableData = res.data.data;
          state.loading = false;
        }else{
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
      Plus,
      Delete,
      Edit,
      methods,
      Search,
      Refresh,
      iconList,
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

.table {
  margin-top: 18px;
}

.flex.dialog {
  .el-dialog__body {
    padding-bottom: 0;
  }

  .iconInput {
    cursor: pointer;

    .el-input__inner {
      cursor: pointer;
    }
  }
}
.iconBox {
  display: flex;
  flex-wrap: wrap;
  height: 300px;
  overflow: auto;

  li {
    width: 30px;
    text-align: center;
    line-height: 30px;
    height: 30px;
    transition: .4s;
    cursor: pointer;
    margin: 6px;

    i {
      font-size: 20px;
    }
  }
}
</style>