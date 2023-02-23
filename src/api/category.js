import {request} from "../utils/request";

export function getCategoryList(params){
    return request('/back/category/list',params,'GET');
}
export function getCategory(params){
    return request('/back/category',params,'GET');
}
export function addCategory(params){
    return request('/back/category/add',params,'POST');
}
export function updateCategory(params){
    return request('/back/category/update',params,'POST');
}
export function deleteCategory(params){
    return request('/back/category/delete',params,'POST');
}