<template>
  <div class="header-menu my-dark animate">
    <button class="iconfont" @click="methods.MenuShow">
      {{ state.isCollapse ? '\ue646' : '\ue64b' }}
    </button>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{path:'/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="item in state.menuList">{{item}}</el-breadcrumb-item>
      </el-breadcrumb>

    <img :src="store.getters.getAvatar" id="avatar">
    <el-dropdown :hide-on-click="false" @command="methods.handleCommand" placement="bottom">
      <span>
      {{ store.getters.getName }}
    </span>
      <i class="iconfont icon-xiala"></i>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="/my">个人资料</el-dropdown-item>
          <el-dropdown-item command="/login">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <a href="http://www.ccenote.com" target="_blank" id="ccenote">项目官网</a>
    <el-switch id="nihao" v-model="state.isDark" :active-icon="Moon" :inactive-icon="Sunny" size="small"
               style="--el-switch-on-color: #2C2C2C;--el-switch-border-color:#ccc8db;"/>
    <i class="iconfont" id="zoom" @click="methods.zoom">{{state.isZoom?'\ue648':'\ue649'}}</i>
  </div>

</template>

<script>
import screenfull from 'screenfull'
import store from "../../../store"
import {reactive,watch} from 'vue'
import {ElMessage, ElMessageBox} from "element-plus"
import {logout} from '../../../api/admin'
import {Key,Sunny, Moon} from '@element-plus/icons-vue'
import {delData, getMenu} from "../../../utils/auth";
import router from "../../../router";
import {useDark} from '@vueuse/core';
export default {
  name: "index",
  emits: ["MenuShow"],
  setup(props,context){
    const state=reactive({
      isDark: useDark(),
      isCollapse: true,
      isZoom: true,
      menuList:[],
    })
    // router.currentRoute.value.path
    const methods={
      getCrumbs:(index)=>{
        if(index==='/my'){
          state.menuList=[];
          state.menuList.push('个人资料');
          return false;
        }else if(index==='/') {
          state.menuList=[];
          return false;
        }
        for(let i=0;i<getMenu().length;i++){
          if(getMenu()[i].front_router===null&&getMenu()[i].children.length!==0){
            for(let x=0;x<getMenu()[i].children.length;x++){
              if('/'+getMenu()[i].children[x].front_router===index){
                state.menuList=[];
                state.menuList.push(getMenu()[i].name);
                state.menuList.push(getMenu()[i].children[x].name);
                return false;
              }
            }
          }else{
            if('/'+getMenu()[i].front_router===index){
              state.menuList=[];
              state.menuList.push(getMenu()[i].name);
              return;
            }
          }
        }
      },
      handleCommand(command){
        if(command==="/login"){
          methods.logout();
        }else{
          router.replace(command);
        }
      },
      MenuShow() {
        context.emit('MenuShow', state.isCollapse);
        state.isCollapse = !state.isCollapse
      },
      //全屏
      zoom() {
        if (!screenfull.isEnabled) {
          ElMessage({
            message: '您的浏览器版本过低，不支持全屏浏览',
            type: 'warning'
          })
          return false;
        }
        state.isZoom = !state.isZoom;
        screenfull.toggle();
      },
      logout(){
        ElMessageBox.confirm('确定要退出吗？', {confirmButtonText: '确定', cancelButtonText: '取消'}).then(() => {
          logout().then(res=>{
            delData()
            state.dialogVisible=false;
            router.replace({path:'/login'});
          })
        }).catch(() => {
        })
      }
    }
    watch(()=>router.currentRoute.value.path,item=>{
        methods.getCrumbs(item);
    })
    methods.getCrumbs(router.currentRoute.value.path);
    return {
      state,
      methods,
      Key,
      store,
      Sunny,
      Moon
    }
  }
}
</script>

<style lang="less">
.el-header {
  padding: 0;
  .header-menu {
    height: 100%;
    .el-breadcrumb{
      float: left;
      height: 50px;
      line-height: 50px;
    }
  }

  .el-dropdown {
    height: 50px;
    line-height: 50px;
    vertical-align: -1px;
    cursor: pointer;
    float:right;
    .el-tooltip__trigger{
      transition:.2s;
    }
    >div{
      >*{
        vertical-align: middle;
      }
    }
  }
  button.iconfont {
    background: none;
    border: none;
    cursor: pointer;
    font-weight: bold;
    width: 50px;
    height: 50px;
    line-height: 21px;
    font-size: 14px;
    float: left;
  }
  #avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid rgb(222 229 231);
    cursor: pointer;
    margin:8px 18px 8px 5px;
    vertical-align: middle;
    float: right;
  }
  .el-sub-menu__title {
    padding: 0 10px;
  }
  .el-switch{
    margin:13px 12px;
    float:right;
  }

}

#zoom {
  float: right;
  cursor: pointer;
  margin-right: 6px;
  font-size: 14px;
}
#ccenote{
  float:right;
  margin-right:20px;
  transition:.2s;
}

.el-breadcrumb__inner{
  cursor: pointer !important;
  transition:.2s !important;
}
</style>