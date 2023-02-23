<template>
  <footer class="footer my-dark animate">
    <span>{{state.copy}}</span>
    <span>{{state.edition}}</span>
  </footer>
</template>

<script>
import {reactive} from 'vue';
export default {
  name: "index",
  setup(){
    const state=reactive({
      copy:'Copyright ©2021-2022 ccenote(www.ccenote.com), All Rights Reserved',
      edition:'v1.0.0'
    });
    return{
      state
    }
  }
}
</script>

<style lang="less">
.footer {
  display: flex;
  line-height:45px;
  padding:0 18px;
  width:100%;
  justify-content: space-between;
  border-top: 1px solid rgb(222 229 231);
}
</style>