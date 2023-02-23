<template>
  <div class="flex dialog">
    <el-button type="success" :icon="Document" @click="router.replace({path:'/article'})">文章列表</el-button>
  </div>
  <div class="table">
    <el-dialog v-model="state.dialogFormVisible" title="评论文章" :before-close="methods.handleClose"
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
        @selection-change="methods.select"
        row-key="id"
    >
      <el-table-column type="selection"/>
      <el-table-column prop="title" label="文章标题"/>
      <el-table-column prop="category" sortable label="文章分类"/>
      <el-table-column prop="author" label="作者"/>
      <el-table-column prop="page_views" sortable label="浏览量"/>
      <el-table-column prop="comment_status" label="评论状态"/>
      <el-table-column prop="key" label="是否加密"/>
      <el-table-column prop="is_top" label="是否置顶"/>
      <el-table-column prop="create_time" label="发布时间"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" :icon="Edit" @click="methods.openLink(scope.row.id)"/>
          <el-button type="primary" :icon="ChatDotRound" @click="methods.openDialog(scope.row.id)"/>
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
import {Plus, Search, Refresh, Delete, Edit,ChatDotRound,Document} from '@element-plus/icons-vue';
import {deleteArticle, getArticleList, searchArticle} from "../../api/article";
import {ElMessage, ElMessageBox} from "element-plus";
import router from "../../router";
import {addComment} from "../../api/comment";
export default {
  name: "drafts",
  setup(){
    const {proxy} = getCurrentInstance();
    const state=reactive({
      tableData: [],
      loading: true,
      dialogFormVisible: false,
      currentPage: 0,
      total: 0,
      per_page: 0,
      last_page: 0,
      deleteArray: [],
      form: {
        id: '',
        content:'',
        parent_id:'',
        article_id:''
      }
    });
    const methods={
      handleCurrentChange: (page) => {
          getLists(page);
      },
      select: (val) => {
        state.deleteArray = [];
        val.forEach(item => {
          state.deleteArray.push(item.id);
        })
      },
      openLink:(id)=>{
          router.push({
            path:'/admin/article/update',
            query:{
              'id':id
            }
          })
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
        state.form.article_id=val;
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
          deleteArticle({
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
      getArticleList({
        status:0,
        page
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
      Document,
      Plus,
      Search,
      Refresh,
      Delete,
      Edit,
      ChatDotRound,
      router
    }
  }
}
</script>

<style lang="less">
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
}
</style>