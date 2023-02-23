<template>
  <div id="config">
    <el-tabs class="demo-tabs">
      <el-tab-pane label="网站LOGO">
        <el-form class="logo">
          <el-form-item>
            <el-tooltip
                class="box-item"
                effect="dark"
                content="点击上传LOGO"
                placement="right"
            >
              <el-upload
                  ref="upload"
                  class="logo-uploader"
                  action="#"
                  :multiple="false"
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="methods.fileChange"
                  :http-request="methods.updateLogo"
              >
                <el-image :src="state.logo">
                  <template #error>
                    <div class="image-slot">
                      加载失败
                    </div>
                  </template>
                </el-image>
                <el-icon class="logo-uploader-icon">
                  <Plus/>
                </el-icon>
              </el-upload>
            </el-tooltip>
          </el-form-item>
          <el-button type="primary" @click="methods.submitUpload">上传LOGO</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="基础配置">
        <el-form label-position="right" :model="state.form" :rules="state.rules" ref="form"
        >
          <el-form-item label="网站标题：" prop="title">
            <el-input v-model="state.form.title" placeholder="请输入网站标题" clearable/>
          </el-form-item>
          <el-form-item label="网站描述：" prop="description">
            <el-input v-model="state.form.description" placeholder="请输入网站描述" clearable/>
          </el-form-item>
          <el-form-item label="关键词：" prop="keywords">
            <el-input v-model="state.form.keywords" type="textarea" placeholder="请输入网站关键字,用半角逗号隔开"/>
          </el-form-item>
          <el-form-item label="联系方式：" prop="contact">
            <el-input v-model="state.form.contact" placeholder="请输入联系方式" clearable/>
          </el-form-item>
          <el-form-item label="备案信息：" prop="record">
            <el-input v-model="state.form.record" placeholder="请输入备案信息" clearable/>
          </el-form-item>
          <el-form-item label="版权信息：" prop="copyright">
            <el-input v-model="state.form.copyright" placeholder="请输入版权信息" clearable/>
          </el-form-item>
          <el-form-item label="网站版本：" prop="edition">
            <el-input v-model="state.form.edition" placeholder="请输入网站版本" clearable/>
          </el-form-item>
          <el-button type="primary" @click="methods.submitConfig"
          >提交
          </el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="系统配置">
        <el-form label-position="left" :model="state.form" :rules="state.rules" ref="form" class="system-config"
        >
          <el-form-item prop="is_register" label="注册状态：">
            <el-radio-group v-model="state.form.is_register">
              <el-radio-button label="1">启用</el-radio-button>
              <el-radio-button label="0">禁用</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="grey" label="网站变灰：">
            <el-radio-group v-model="state.form.grey">
              <el-radio-button label="1">启用</el-radio-button>
              <el-radio-button label="0">禁用</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="前台每页内容数：" prop="front_page_num">
            <el-input v-model="state.form.front_page_num" placeholder="请输入网站标题" clearable/>
          </el-form-item>
          <el-form-item label="后台每页内容数：" prop="back_page_num">
            <el-input v-model="state.form.back_page_num" placeholder="请输入网站标题" clearable/>
          </el-form-item>
          <!--          不可通过后台登录的角色-->
          <el-button type="primary" @click="methods.submitConfig"
          >提交
          </el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="网站状态">
        <el-form label-position="right" :model="state.form" :rules="state.rules" ref="form"
        >
          <el-form-item prop="site_status" label="网站状态：">
            <el-radio-group v-model="state.form.site_status">
              <el-radio-button label="1">开启</el-radio-button>
              <el-radio-button label="0">关闭</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="关闭原因：" prop="close_reason" v-if="state.form.site_status==='0'">
            <el-input v-model="state.form.close_reason" type="textarea" placeholder="请输入网站关闭原因"/>
          </el-form-item>
          <el-button type="primary" @click="methods.submitConfig"
          >提交
          </el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="评论设置">
        <el-form label-position="right" :model="state.form" :rules="state.rules" ref="form"
        >
          <el-form-item label="评论关键字：" prop="commentKeyword">
            <el-input v-model="state.form.commentKeyword" type="textarea"
                      placeholder="请输入评论关键字,用半角逗号隔开"/>
          </el-form-item>
          <el-button type="primary" @click="methods.keywordSubmit()"
          >提交
          </el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="网站公告">
        <el-form label-position="right" :model="state.form" :rules="state.rules" ref="form"
        >
          <el-form-item label="网站公告：" prop="notice">
            <el-input v-model="state.form.notice" type="textarea"
                      placeholder="请输入网站公告"/>
          </el-form-item>
          <el-button type="primary" @click="methods.submitConfig"
          >提交
          </el-button>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {reactive, getCurrentInstance} from "vue";
import {ElMessage} from "element-plus";
import {Plus, Key} from '@element-plus/icons-vue'
import {getConfig, updateConfig, setLogo, getKeyword, setKeyword} from "../../api/config";

export default {
  name: "config",
  components: {
    Plus
  },
  setup() {
    const {proxy} = getCurrentInstance();
    const state = reactive({
      logo: '',
      roleData: [],
      form: {
        title: '',
        description: '',
        keywords: '',
        is_register: 1,
        site_status: 1,
        close_reason: '',
        copyright: '',
        record:'',
        edition: '',
        front_page_num: 10,
        back_page_num: 10,
        contact:'',
        notice:'',
        grey:0,
        commentKeyword: ''
      },
      rules: {
        title: [
          {required: true, message: '请输入网站标题', trigger: 'blur'}
        ],
        is_register: [
          {required: true, message: '请选择注册状态', trigger: 'blur'}
        ],
        site_status: [
          {required: true, message: '请选择网站状态', trigger: 'blur'}
        ],
        grey:[
          {required: true, message: '请选择网站状态', trigger: 'blur'}
        ],
        front_page_num: [
          {required: true, message: '请输入前端内容展示输入', trigger: 'blur'}
        ],
        back_page_num: [
          {required: true, message: '请输入后台内容展示输入', trigger: 'blur'}
        ],
      }
    });
    const methods = {
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
          state.logo = URL.createObjectURL(file.raw);
        } else {
          fileList.splice(-1, 1);
        }
      },
      updateLogo(param) {
        const formData = new FormData();
        formData.append('logo', param.file);
        setLogo(formData).then(res => {
          if (res.data.status) {
            ElMessage({
              message: "上传成功",
              type: 'success'
            })
            let getCacheTime = new Date().getTime();
            state.logo = res.data.data.logo + '?cache=' + getCacheTime;
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
      submitConfig: () => {
        proxy.$refs['form'].validate(valid => {
          if (valid) {
            updateConfig({
              title: state.form.title,
              description: state.form.description,
              keywords: state.form.keywords,
              is_register: state.form.is_register,
              site_status: state.form.site_status,
              close_reason: state.form.close_reason,
              copyright: state.form.copyright,
              record:state.form.record,
              edition: state.form.edition,
              front_page_num: state.form.front_page_num,
              back_page_num: state.form.back_page_num,
              contact:state.form.contact,
              notice:state.form.notice,
              grey:state.form.grey
            }).then(res => {
              if (res.data.status) {
                ElMessage({
                  message: res.data.message,
                  type: 'success'
                })
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
      keywordSubmit: () => {
        setKeyword({
          keyword:state.form.commentKeyword
        }).then(res=>{
          if(res.data.status){
            ElMessage({
              message: res.data.message,
              type: 'success'
            })
          }else{
            ElMessage({
              message: res.data.error,
              type: 'error'
            })
          }
        })
      }
    };
    getConfig().then(res => {
      if (res.data.status) {
        state.form.title = res.data.data.title;
        state.form.description = res.data.data.description;
        state.form.keywords = res.data.data.keywords;
        state.form.is_register = res.data.data.is_register;
        state.form.site_status = res.data.data.site_status;
        state.form.close_reason = res.data.data.close_reason;
        state.form.copyright = res.data.data.copyright;
        state.form.edition = res.data.data.edition;
        state.form.record=res.data.data.record;
        state.form.front_page_num = res.data.data.front_page_num;
        state.form.back_page_num = res.data.data.back_page_num;
        state.form.contact=res.data.data.contact;
        state.form.notice=res.data.data.notice;
        state.form.grey=res.data.data.grey;
        state.logo = res.data.data.logo;
      } else {
        ElMessage({
          message: res.data.error,
          type: 'error'
        })
      }
    })
    getKeyword().then(res=>{
      if (res.data.status) {
          state.form.commentKeyword=res.data.data;
      } else {
        ElMessage({
          message: res.data.error,
          type: 'error'
        })
      }
    })
    return {
      state,
      methods
    }
  }
}
</script>

<style lang="less">

.logo-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 550px;
  height: 148px;
}

.logo-uploader .el-upload:hover {
  border-color: #409EFF;
}

.logo-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transition: .2s;
}

.logo-uploader-icon:hover {
  color: #fff;
  background: rgba(255, 255, 255, .5);
}

#config {
  .el-image {
    width: 100%;
    height: 100%;

    .el-image__wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .el-form {
    width: 60%;

    .el-button {
      width: 100%;
    }
  }

  .logo {
    .el-button {
      width: 550px;
    }
  }

  .system-config {
    .el-form-item__label {
      width: 200px;
    }
  }

  .el-form-item__label {
    width: 100px;
  }
}

</style>