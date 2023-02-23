import {createRouter, createWebHistory} from "vue-router";
const modules=import.meta.glob("../views/**/**.vue");
const constantRouter = [
    {
        path:'/',
        name:'index',
        component:modules[`../views/admin/index.vue`],
        meta: {
            title: "后台首页",
            requireAuth: true,
        },
        children: [
            {
                path:'',
                name:'home',
                component:modules[`../views/admin/home.vue`],
                meta:{
                    title:"后台首页"
                }
            },
            {
                path: 'my',
                component: modules[`../views/admin/my.vue`],
                meta: {
                    title: "个人资料"
                }
            },
            {
                path: 'article/add',
                component: modules[`../views/admin/edit_article.vue`],
                meta: {
                    title: "添加文章"
                }
            },
            {
                path:'article/drafts',
                component:modules[`../views/admin/drafts.vue`],
                meta:{
                    title:"草稿箱"
                }
            },
            {
                path: 'article/update',
                component: modules[`../views/admin/edit_article.vue`],
                meta: {
                    title: "修改文章"
                }
            },
        ],
    },
    {
        path: '/login',
        name:'login',
        component: modules[`../views/login.vue`],
        meta: {
            title: "登录",
            noAuth: true
        },
    },
];
const router = createRouter({
    scrollBehavior: () => ({x: 0, y: 0}),
    history: createWebHistory(),
    routes: constantRouter,
});
export default router;