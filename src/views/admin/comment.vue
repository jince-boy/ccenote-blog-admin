<template>
  <div class="search">
    <el-form :model="state.form" :rules="state.rules" ref="form"
    >
      <el-form-item prop="searchUsername">
        <el-input v-model="state.form.searchUsername" placeholder="用户名"/>
      </el-form-item>
      <el-form-item prop="searchUserType">
        <el-select v-model="state.form.searchUserType" placeholder="用户类型">
          <el-option label="前台用户" value="front" />
          <el-option label="后台用户" value="back" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="methods.handleCurrentChange(1)">查询</el-button>
        <el-button type="primary" :icon="Refresh" @click="state.form.searchUsername='';state.form.searchUserType=''">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="table">
    <el-dialog v-model="state.dialogFormVisible" title="回复评论" :before-close="methods.handleClose"
               destroy-on-close draggable>
      <el-form :model="state.form" :rules="state.rules" ref="form" label-position="top" label-width="100px"
      >
        <el-form-item prop="content" label="回复内容：">
          <el-input
              v-model="state.form.content"
              type="textarea"
              placeholder="请输入回复内容"
              clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="methods.submitMethod"
        >回复</el-button
        >
      </span>
      </template>
    </el-dialog>
    <el-table
        ref="table"
        :data="state.tableData"
        v-loading="state.loading"
        table-layout="auto"
        row-key="id"
    >
      <el-table-column prop="id" label="ID" align="center"/>
      <el-table-column prop="parent_id" label="上级评论ID" align="center"/>
      <el-table-column prop="article.article_title" label="评论文章" width="120px" show-overflow-tooltip/>
      <el-table-column prop="content" label="评论内容" show-overflow-tooltip/>

      <el-table-column prop="user.username" label="评论用户"/>
      <el-table-column prop="user.user_type" label="用户类型"/>

      <el-table-column prop="time" label="评论时间"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-tooltip content="回复评论" placement="top" effect="light">
            <el-button type="primary" :icon="ChatDotRound" @click="methods.openDialog(scope.row)"/>
          </el-tooltip>
          <el-button type="danger" :icon="Delete" @click="methods.delete(scope.row.id)"/>
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
import {getCurrentInstance, reactive} from "vue";
import {Delete, Edit, Plus, Refresh, Search,ChatDotRound} from "@element-plus/icons-vue";
import {addComment, deleteComment, getCommentList, searchComment} from "../../api/comment";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "comment",
  setup(){
    const {proxy} = getCurrentInstance();
    const state = reactive({
      tableData: [],
      loading: true,
      dialogFormVisible: false,
      currentPage: 0,
      total: 0,
      per_page: 0,
      last_page: 0,
      deleteArray: [],
      form: {
        searchUsername:'',
        searchUserType:'',
        id: '',
        content:'',
        article_id:'',
        parent_id:'',
      },
      rules: {
        searchUsername: [
          {required: true, message: '用户名不能为空', trigger: 'blur'}
        ],
        searchUserType: [
          {required: true, message: '用户类型不能为空', trigger: 'blur'}
        ],
        content:[
          {required: true, message: '请输入用户名', trigger: 'blur'},
        ]
      },
    })
    const methods={
      search:(page)=>{
        proxy.$refs['form'].validate(valid => {
          if(valid){
            searchComment({
              username:state.form.searchUsername,
              usertype:state.form.searchUserType,
              page
            }).then(res=>{
              if(res.data.status){
                state.loading = false;
                state.tableData = res.data.data.data;
                state.currentPage = res.data.data.current_page;
                state.total = res.data.data.total;
                state.per_page = res.data.data.per_page;
                state.last_page = res.data.data.last_page;
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
      handleClose: () => {
        ElMessageBox.confirm('确定要关闭吗？', {confirmButtonText: '确定', cancelButtonText: '取消'}).then(() => {
          state.dialogFormVisible = false;
          proxy.$refs['form'].resetFields();
        }).catch(() => {
        })
      },
      handleCurrentChange: (page) => {
        if(state.form.searchUsername===''&&state.form.searchUserType===''){
          getLists(page);
        }else{
          methods.search(page);
        }
      },
      submitMethod: () => {
        addComment({
          article_id:state.form.article_id,
          content:state.form.content,
          parent_id:state.form.parent_id
        }).then(res=>{
          if (res.data.status) {
            state.loading = false;
            ElMessage({
              message: res.data.message,
              type: 'success'
            })
            getLists();
            state.dialogFormVisible=false;
            proxy.$refs['form'].resetFields();
          } else {
            ElMessage({
              message: res.data.error,
              type: 'error'
            })
          }
        })
      },
      openDialog:(val)=>{
        state.dialogFormVisible=true;
        state.form.article_id=val.article.article_id;
        state.form.parent_id=val.id;
      },
      delete: (id) => {
        ElMessageBox.confirm('确定要删除吗？', {confirmButtonText: '确定', cancelButtonText: '取消'}).then(() => {
          deleteComment({
            id:id
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
    function getLists(page){
      getCommentList({
        page:page
      }).then(res=>{
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
      Search,
      methods,
      Refresh,
      Delete,
      Edit,
      ChatDotRound,
      Plus
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
    width: 50%;
    .el-textarea__inner{
      height:130px;
    }
    .el-form-item__content {
      justify-content: center;
    }
  }
  .el-popper{
    width:500px;
  }
}

</style>