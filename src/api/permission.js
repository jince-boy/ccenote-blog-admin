import {request} from "../utils/request";

export function getList(params){
    return request('/back/permission/list',params,'GET');
}
export function getPermission(params){
    return request('/back/permission',params,'GET');
}
export function addPermission(params){
    return request('/back/permission/add',params,'POST');
}
export function updatePermission(params){
    return request('/back/permission/update',params,'POST');
}
export function deletePermission(params){
    return request('/back/permission/delete',params,'POST');
}