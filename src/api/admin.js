import {request} from "../utils/request";

export function getVerifyCode(params){
    return request('/back/admin/getVerifyCode',params,'GET');
}
export function login(params){
    return request('/back/admin/login',params,'POST');
}
export function logout(params){
    return request('/back/admin/logout',params,'POST');
}
export function updatePassword(params){
    return request('/back/admin/updatePassword',params,'POST');
}
export function getMyData(params){
    return request('/back/admin/my',params,'GET');
}
export function updateMyData(params){
    return request('/back/admin/my/update',params,'POST');
}
export function updateMyAvatar(params){
    return request('/back/admin/my/updateAvatar',params,'POST');
}
export function getMyMenu(params){
    return request('/back/admin/my/getMenu',params,'GET');
}
export function getAdminUserList(params){
    return request('/back/admin/user/list',params,'GET');
}
export function getAdminUser(params){
    return request('/back/admin/user',params,'GET');
}
export function addAdminUser(params){
    return request('/back/admin/user/add',params,'POST');
}
export function updateAdminUser(params){
    return request('/back/admin/user/update/data',params,'POST');
}
export function deleteAdminUser(params){
    return request('/back/admin/user/delete',params,'POST');
}
export function updateAdminUserAvatar(params){
    return request('/back/admin/user/update/avatar',params,'POST');
}