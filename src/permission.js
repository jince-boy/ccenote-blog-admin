import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {getPageTitle} from "./utils/get-page-title";
import {getToken, getMenu, getRole} from "./utils/auth";
import store from "./store";
//页面进度条
NProgress.configure({
    showSpinner: false
});

router.beforeEach(async (to, from, next) => {
    NProgress.start();

    document.title = getPageTitle(store.getters.getConfig.title,to.meta.title);

    if (getToken()) {
        if (to.path === '/login' || to.path === '/register') {
            next({path: '/'});
            NProgress.done();
        } else {
            if (getMenu()) {
                next();
            } else {
                await store.dispatch('getUserData');
                await store.dispatch('getConfig');
                // await store.dispatch('getMenu');
                next({...to, replace: true});
                NProgress.done();
            }
        }
    }else{
        if (to.path === '/login' || to.path === '/register'||to.path==='/reset') {
            next();
            NProgress.done();
        }else{
            next({path:'/login'});
            NProgress.done();
        }
    }
})
router.afterEach(() => {
    NProgress.done();
})
