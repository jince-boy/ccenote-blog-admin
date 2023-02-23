<template>
  <div class="flex dialog">
    <el-button type="primary" :icon="Plus" @click="methods.openMethod('add')">新建</el-button>
    <!--    <el-button type="danger" :icon="Delete">删除</el-button>-->
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
        <el-form-item prop="name" label="权限名称：">
          <el-input v-model="state.form.name" clearable/>
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
        <el-form-item prop="description" label="权限描述：">
          <el-input v-model="state.form.description" clearable/>
        </el-form-item>
        <el-form-item prop="front_router" label="前端路由：" v-if="state.form.is_menu==='1'">
          <el-input v-model="state.form.front_router" clearable/>
        </el-form-item>
        <el-form-item prop="alias" label="路由别名：" v-if="state.form.is_menu==='1'">
          <el-input v-model="state.form.alias" clearable/>
        </el-form-item>
        <el-form-item prop="template_address" label="路由模板：" v-if="state.form.is_menu==='1'">
          <el-input v-model="state.form.template_address" clearable/>
        </el-form-item>
        <el-form-item prop="back_api" label="后端路由：" v-if="state.form.is_menu!=='1'">
          <el-input v-model="state.form.back_api" clearable/>
        </el-form-item>
        <el-form-item prop="order" label="顺序标识：">
          <el-input v-model="state.form.order" clearable/>
        </el-form-item>
        <el-form-item prop="parent_id" label="父级节点：">
          <el-tree-select v-model="state.form.parent_id" :data="state.tableData" check-strictly node-key="id"
                          :props="state.defaultProps" style="width:100%;" placeholder="可以为空，默认为根节点"
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
        :data="state.tableData"
        v-loading="state.loading"
        row-key="id"
    >
      <!--      <el-table-column prop="id" label="ID"/>-->
      <el-table-column prop="name" label="权限名称" sortable/>
      <el-table-column prop="description" label="权限描述" align="center"/>
      <el-table-column prop="is_menu" label="是否菜单" sortable align="center">
        <template #default="scope">
          {{ scope.row.is_menu === "0" ? "否" : "是" }}
        </template>
      </el-table-column>
      <el-table-column prop="front_router" label="前端路由"/>
      <el-table-column prop="back_api" label="后端路由"/>
      <el-table-column prop="icon" label="图标" align="center">
        <template #default="scope">
          <i :class="['iconfont',scope.row.icon]"></i>
        </template>
      </el-table-column>
      <el-table-column prop="order" label="顺序标识" sortable align="center"/>
      <el-table-column prop="status" label="状态" align="center">
        <template #default="scope">
          {{ scope.row.status === "0" ? "禁用" : "启用" }}
        </template>
      </el-table-column>
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
import {getList, addPermission, updatePermission, getPermission,deletePermission} from "../../api/permission";
import {ElMessage, ElMessageBox} from 'element-plus';
import iconList from "../../utils/icon";

export default {
  name: "permission",
  setup() {
    const {proxy} = getCurrentInstance();
    const state = reactive({
      tableData: [],
      loading: true,
      dialogFormVisible: false,
      iconVisible: false,
      dialogTitle: '添加权限',
      method:'add',
      defaultProps: {
        label: 'name'
      },
      form: {
        id: '',
        name: '',
        is_menu: "0",
        order: '',
        front_router: '',
        alias:'',
        template_address:'',
        back_api: '',
        description: '',
        icon: '',
        parent_id: '',
        status: '1',
      },
      rules: {
        name: [
          {required: true, message: '请输入权限名称', trigger: 'blur'},
          {min: 1, max: 20, message: '输入格式错误', trigger: 'blur'}
        ],
        is_menu: [
          {required: true, message: '请选择是否为菜单', trigger: 'blur'},
        ],
        order: [
          {min: 0, max: 20, message: '输入格式错误', trigger: 'blur'}
        ],
        front_router: [
          {min: 1, max: 255, message: '输入字符个数应在1到255之间', trigger: 'blur'}
        ],
        alias:[
          {type:'string',message:'必须为字符串',trigger:'blur'},
          // {required: true, message: '请输入路由别名', trigger: 'blur'},
        ],
        template_address:[
          {type:'string',message:'必须为字符串',trigger:'blur'},
        ],
        back_api: [
          {min: 1, max: 255, message: '输入字符个数应在1到255之间', trigger: 'blur'}
        ],
        description: [
          {min: 1, max: 255, message: '输入字符个数应在1到255之间', trigger: 'blur'}
        ],
        icon: [
          {min: 1, max: 255, message: '输入字符个数应在1到255之间', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择状态', trigger: 'blur'},
        ]
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
          state.form.icon = '';
          proxy.$refs['form'].resetFields();
        }).catch(() => {
        })
      },
      openMethod: (method, id) => {
        if (method === 'add') {
          state.method='add';
          state.dialogFormVisible = true;
          state.dialogTitle = '添加权限';
        } else if (method === 'update') {
          state.method='update';
          state.form.id = id;
          state.dialogFormVisible = true;
          state.dialogTitle = '修改权限';
          getPermission({
            id: state.form.id,
          }).then(res => {
            if(res.data.status){
              state.form.name = res.data.data.name;
              state.form.is_menu = res.data.data.is_menu;
              state.form.front_router = res.data.data.front_router;
              state.form.alias=res.data.data.alias;
              state.form.template_address=res.data.data.template_address;
              state.form.back_api = res.data.data.back_api;
              state.form.description = res.data.data.description;
              state.form.icon = res.data.data.icon;
              state.form.parent_id = res.data.data.parent_id;
              if(res.data.data.order!==null){
                state.form.order = res.data.data.order.toString();
              }
              state.form.status = res.data.data.status;
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
            addPermission({
              name: state.form.name,
              is_menu: state.form.is_menu,
              order: state.form.order,
              front_router: state.form.front_router,
              alias:state.form.alias,
              template_address:state.form.template_address,
              back_api: state.form.back_api,
              description: state.form.description,
              icon: state.form.icon,
              parent_id: state.form.parent_id,
              status: state.form.status
            }).then(res => {
              if (res.data.status) {
                ElMessage({
                  message: res.data.message,
                  type: 'success'
                })
                getLists();
                state.dialogFormVisible = false;
                state.form.icon = '';
                state.form.back_api='';
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
            updatePermission({
              id: state.form.id,
              name: state.form.name,
              is_menu: state.form.is_menu,
              order: state.form.order,
              front_router: state.form.front_router,
              alias:state.form.alias,
              template_address:state.form.template_address,
              back_api: state.form.back_api,
              description: state.form.description,
              icon: state.form.icon,
              parent_id: state.form.parent_id,
              status: state.form.status
            }).then(res => {
              if (res.data.status) {

                ElMessage({
                  message: res.data.message,
                  type: 'success'
                })
                getLists();
                state.dialogFormVisible = false;
                state.form.icon = '';
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
          deletePermission({
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
      getList().then(res => {
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