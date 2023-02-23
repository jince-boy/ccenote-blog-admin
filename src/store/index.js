import {createStore} from 'vuex'
import {getMyData} from "../api/admin";
import router from "../router";
import {getConfig} from "../api/config";

export default createStore({
    state: {
        token: '',
        name: '',
        avatar: '',
        role: '',
        menu: '',
        pageShow: false,
        config:'',
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
            localStorage.setItem("token", token);
        },
        delToken(state) {
            state.token = "";
            localStorage.removeItem("token");
        },
        setRole(state, role) {
            state.role = role;
        },
        delRole(state) {
            state.role = ''
        },
        setName(state, name) {
            state.name = name;
        },
        delName(state) {
            state.name = "";
        },
        setAvatar(state, avatar) {
            state.avatar = avatar;
        },
        delAvatar(state) {
            state.avatar = "";
        },
        setMenu(state, menu) {
            state.menu = menu;
        },
        delMenu(state) {
            state.menu = "";
        },
        setPageShow(state, pageShow) {
            state.pageShow = pageShow;
        },
        delPageShow(state) {
            state.pageShow = false;
        },
        setConfig(state,config){
            state.config=config;
        },
        delConfig(state){
            state.config="";
        }
    },
    getters: {
        getToken: state => state.token,
        getName: state => state.name,
        getAvatar: state => state.avatar,
        getMenu: state => state.menu,
        getPageShow: state => state.pageShow,
        getRole: state => state.role,
        getConfig:state=>state.config
    },
    actions: {
        getConfig:(context)=>{
          return new Promise(resolve => {
              getConfig().then(res=>{
                  if(res.data.status){
                      context.commit('setConfig',res.data.data);
                  }
                  resolve(res.data.data);
              })
          })
        },
        getUserData: (context) => {
            return new Promise(resolve => {
                getMyData().then(res => {
                    if (res.data.status) {
                        context.commit('setPageShow', true);
                        context.commit('setName', res.data.data.name);
                        context.commit('setAvatar', res.data.data.avatar);
                        context.commit('setRole', res.data.data.role)
                        context.commit('setMenu',res.data.data.menu);
                    } else {
                        context.commit('setPageShow', false);
                    }
                    addRouter(res.data.data.menu);
                    resolve(res.data.data);
                })

            })
        }
    }
})
const modules = import.meta.glob("../views/**/**.vue");

function addRouter(routes) {

    routes.forEach(route => {
        if(route.front_router==null){
            if(route.children.length!==0){
                route.children.forEach(childrenRoute=>{
                    router.addRoute('index', {
                        path:childrenRoute.front_router,
                        name:childrenRoute.alias,
                        component:modules[`../views/${childrenRoute.template_address}.vue`],
                        meta:{
                            title:childrenRoute.name
                        }
                    })
                })
            }
        }else{
            router.addRoute('index', {
                path:route.front_router,
                name:route.alias,
                component: modules[`../views/${route.template_address}.vue`],
                meta:{
                    title:route.name
                }
            })
        }
    })
    router.addRoute({path: '/:pathMatch(.*)*', name: 'not-found', component: modules['../views/404.vue']})
}