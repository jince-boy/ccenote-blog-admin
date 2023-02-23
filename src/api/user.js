import {request} from "../utils/request";

export function getUserList(params){
    return request('/back/user/list',params,'GET');
}
export function getUser(params){
    return request('/back/user',params,'GET');
}
export function addUser(params){
    return request('/back/user/add',params,'POST');
}
export function updateUser(params){
    return request('/back/user/update',params,'POST');
}
export function deleteUser(params){
    return request('/back/user/delete',params,'POST');
}
export function updateUserAvatar(params){
    return request('/back/user/update/avatar',params,'POST');
}
export function searchUser(params){
    return request('/back/user/search',params,'GET');
}