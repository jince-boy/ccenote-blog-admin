<template>
  <el-container v-if="store.getters.getPageShow">
    <el-aside :class="state.showClass" id="left-aside">
      <leftAside :MenuShow="state.isShow"></leftAside>
    </el-aside>
    <el-container>
      <el-header>
        <top-header @MenuShow="isCollapse"></top-header>
      </el-header>
      <el-main class="my-dark animate">
        <div class="mainBox animate my-dark">
          <router-view></router-view>
        </div>
      </el-main>
      <botFooter></botFooter>
    </el-container>
  </el-container>
</template>

<script>
import leftAside from "../../components/admin/aside/index.vue";
import topHeader from "../../components/admin/header/index.vue";
import botFooter from "../../components/admin/footer/index.vue";
import store from "../../store"
import {reactive} from 'vue'

export default {
  name: "index",
  components: {
    leftAside,
    topHeader,
    botFooter
  },
  setup() {
    const state = reactive({
      isShow: false,
      showClass: "show-aside",
    })
    const isCollapse = (isCollapse) => {
      state.showClass=isCollapse?"hide-aside":"show-aside";
      state.isShow = isCollapse;
    }
    return {
      state,
      isCollapse,
      store
    }
  }
};
</script>

<style lang="less">
body {
  height: 100%;
}

#app,
.el-container,
.el-aside {
  height: 100%;
}
html.dark .el-aside{
  background-color:#1C1E2C;
  color:#ccc8db;
}
.el-container {
  background: #fff;
}

.el-aside {
  background: #202b36;
  overflow: hidden;
  transition: 0.7s;
}

.el-header {
  height: 50px;
  line-height: 50px;
  box-shadow: 0 2px 2px rgb(0 0 0 / 5%), 0 1px 0 rgb(0 0 0 / 5%);
}

.show-aside {
  width: 200px;
}

.hide-aside {
  width: 60px;
}

.el-main {
  padding: 0;
  background-color: rgb(240, 242, 245);
}
html.dark .el-main.my-dark{
  background: #292C3D !important;
}

.mainBox {
  margin: 18px;
  background-color: #fff;
  padding: 18px;
  border-radius: 4px;
}
html.dark .el-table th.el-table__cell{
  --el-table-header-bg-color:#1c1e2c;
}
</style>