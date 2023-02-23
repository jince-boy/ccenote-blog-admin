<template>
  <div id="logo_box" class="my-dark animate">
    <a href="/"><i class="iconfont">{{ state.logo }}</i></a>
  </div>
  <el-scrollbar style="height: 100%;">
    <el-menu active-text-color="#ffd04b"
             background-color="#1E2B36"
             text-color="#899FB1"
             :collapse="state.isCollapse"
             router
             :default-active="$route.path"
             unique-opened
    >
      <template v-for="item in store.getters.getMenu">
        <el-sub-menu v-if="item.children.length>0" :key="item.id" :index="'/'+item.front_router">
          <template #title>
            <i :class="['iconfont',item.icon]"></i>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item v-for="childItem in item.children" :key="childItem.id"
                        :index="'/'+childItem.front_router">
            <template #title>
              <i :class="['iconfont',childItem.icon]"></i>
              <span>{{ childItem.name }}</span>
            </template>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :key="item.id" :index="'/'+item.front_router">
          <i :class="['iconfont',item.icon]"></i>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import {reactive, watch} from 'vue';
import store from "../../../store";

export default {
  name: "index",
  props: {
    MenuShow: {}
  },
  setup(props) {
    const state = reactive({
      isCollapse: false,
      logo: '\ueb85\ueb85\ueb8a\ueb91\ueb90\ueb97\ueb8a',
    })
    watch(props, newValue => {
      state.isCollapse = newValue.MenuShow;
      if (state.isCollapse) {
        state.logo = '\ueb85';
      } else {
        state.logo = '\ueb85\ueb85\ueb8a\ueb91\ueb90\ueb97\ueb8a';
      }
    })
    return {
      state,
      store
    }
  }
}
</script>

<style lang="less">
#left-aside {
  .el-menu {
    border-right: none;
    user-select: none;
    overflow: hidden;
    background: none;
    .el-menu-item.is-active {
      color: #409EFF !important;
    }
    > .el-menu-item {
      overflow: hidden;
      padding: 0 11px !important;
      .iconfont {
        margin: 0 12px;
        font-size: 14px;
        width: 18px;
        text-align: center;
      }
    }
  }

  #logo_box {
    height: 50px;
    background: #1E2B36;
    line-height: 50px;
    font-weight: 700;
    font-size: 20px;
    color: #C5D0D9;
    text-align: center;

    i {
      font-size: 18px;
      vertical-align: middle;
      color: #4AB8E6;
    }
  }

  .el-sub-menu__title {
    overflow: hidden;
    background:none !important;
    padding: 0 11px !important;
    .iconfont {
      margin: 0 12px;
      font-size: 14px;
      width: 18px;
      text-align: center;
    }
  }

  .el-sub-menu__title:hover {
    background: #18232D !important;
    color: #fff !important;
  }

  .el-menu--inline {
    .el-menu-item {
      padding: 0 !important;
      >span{
        width:56px;
      }
      justify-content: center;

      * {
        margin-right: 12px !important;
        margin-left: 0 !important;
      }
    }
  }

  .el-menu-item:hover {
    color: #fff;
  }

  .el-menu-item, .el-sub-menu__title {
    font-weight: 700;
    height: 40px !important;
    line-height: 40px !important;
  }

}
.el-menu--popup{
  padding:0;
}
.el-popper[data-popper-placement="right-start"] {
  border: none !important;
  left: 60px !important;
  top: 0px;

  .el-menu-item {
    height: 40px;
    line-height: 40px;
  }
  .iconfont{
    margin-right:12px;
  }
  .el-menu {
    border-radius: 0;
  }

  .el-menu-item:hover {
    color: #fff;
  }
}

.el-menu--collapse {
  width: 60px;
  .el-sub-menu__title {
    padding: 0 11px !important;
  }
}
</style>