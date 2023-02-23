import {request} from "../utils/request";

export function getRoleList(params){
    return request('/back/role/list',params,'GET');
}
export function addRole(params){
    return request('/back/role/add',params,'POST');
}
export function updateRole(params){
    return request('/back/role/update',params,'POST');
}
export function deleteRole(params){
    return request('/back/role/delete',params,'POST');
}
export function getRole(params){
    return request('/back/role',params,'GET');
}