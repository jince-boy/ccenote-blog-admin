<template>
  <div id="home">
    <el-row :gutter="12">
      <el-col :span="6">
        <el-card shadow="always"><span class="title">用户:</span>
          <number :from="0" :to="state.user_num" :duration="3" easing="Power1.easeOut"/>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always"><span class="title">文章:</span>
          <number :from="0" :to="state.article_num" :duration="3" easing="Power1.easeOut"/>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always"><span class="title">浏览:</span>
          <number :from="0" :to="state.article_views" :duration="3" easing="Power1.easeOut"/>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always"><span class="title">评论:</span>
          <number :from="0" :to="state.comment_num" :duration="3" easing="Power1.easeOut"/>
        </el-card>
      </el-col>
    </el-row>
    <el-card shadow="never" class="welcome my-dark animate">
      <div>
      <p>{{ methods.getTimeState() }},{{ store.getters.getRole.name }},欢迎使用本程序,本程序为开源的前后端分离项目,感谢你的使用与支持,你可以通过贡献代码,写作,推荐,学习,打赏来支持本项目</p>
      <p>本程序使用技术栈：<span style="font-weight: bold">laravel8、jwt、mysql、redis、vue3、vite3、axios、vue-router、vuex、less、element-ui-plus</span></p>
      <p>项目简介：此项目是一个使用laravel框架基于RABC管理开发的项目,由于作者本人比较喜欢写作的原因,因此开发了这个项目,此项目方便二次开发,后端增加了数据层和业务层,权限认证使用JWT来进行管理,解决了JWT无状态不能分离认证的问题,并将数据表中前后台用户分离,为后期未知的二次开发做好准备,前端使用了vue3+vite,ui使用的是element-ui-plus设计,前端方面也解决了部分认证、动态路由的相关问题。</p>
      <p>关于作者：目前我是一名专科在校生,平时喜欢写作、音乐、摄影,平时写写代码,喝喝茶,代码水平一般,嘿嘿,如果作品有问题勿喷,你可以通过我的邮箱 <span style="text-decoration: underline"><a
          href="mailto:ccenote@163.com">ccenote@163.com</a></span> 来跟我交流问题,再次感谢您的使用。</p>
      </div>
      <img src="../../assets/images/welcome.png" alt="welcome">
    </el-card>
    <el-table :data="state.server" border width="50" >
      <el-table-column prop="name" label="服务器基本信息" width="200" class="my-dark animate" />
      <el-table-column prop="value" />
    </el-table>
  </div>
</template>

<script>
import {getWebData} from "../../api/home";
import {reactive} from "vue";
import {ElMessage} from "element-plus";
import store from "../../store";

export default {
  name: "home",
  setup() {
    const state = reactive({
      server: [],
      user_num: 0,
      article_num: 0,
      article_views: 0,
      comment_num: 0,
      avatar: '',
    });
    const methods = {
      getTimeState: () => {
        let timeNow = new Date();
        let hours = timeNow.getHours();
        let state = ``;
        if (hours >= 0 && hours <= 10) {
          state = `早上好`;
        } else if (hours > 10 && hours <= 14) {
          state = `中午好`;
        } else if (hours > 14 && hours <= 18) {
          state = `下午好`;
        } else if (hours > 18 && hours <= 24) {
          state = `晚上好`;
        }
        return state;
      },
      theFormat: (number) => {
        return number.toFixed(2);
      },
    }

    getWebData().then(res => {
      if (res.data.status) {
        state.server = res.data.data.server;
        state.user_num = res.data.data.user.num;
        state.article_num = res.data.data.article.num;
        state.article_views = res.data.data.article.views;
        state.comment_num = res.data.data.comment.num;
      } else {
        ElMessage({
          message: res.data.error,
          type: 'error'
        })
      }
    });

    return {
      state,
      store,
      methods
    }
  }
}
</script>

<style lang="less">
#home {
  .el-row {
    justify-content: space-between;
    .el-card {
      color: #fff;
      position: relative;

      .el-card__body {
        text-align: center;

        span {
          font-size: 28px;
        }

        .title {
          position: absolute;
          font-size: 12px;
          top: 12px;
          left: 12px;
        }
      }
    }
  }
  .welcome{
    margin-top:12px;
    .el-card__body{
      display: flex;
    }
    p{
      line-height:24px;
      font-size: 12px;
      margin: 6px 0;
    }
    img{
      width:86px;
      height:auto !important;
      margin:0 12px;
    }
  }
  .el-table{
    margin-top:12px;
  }
  .el-col:nth-of-type(1) .el-card {
    background-color: #409EFF;
  }

  .el-col:nth-of-type(2) .el-card {
    background-color: #67C23A;
  }

  .el-col:nth-of-type(3) .el-card {
    background-color: #E6A23C;
  }

  .el-col:nth-of-type(4) .el-card {
    background-color: #F56C6C;
  }
}

</style>