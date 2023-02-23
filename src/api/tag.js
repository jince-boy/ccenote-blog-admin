import {request} from "../utils/request";

export function getTagList(params){
    return request('/back/tag/list',params,'GET');
}
export function getTagData(params){
    return request('/back/tag',params,'GET');
}
export function addTag(params){
    return request('/back/tag/add',params,'POST');
}
export function updateTag(params){
    return request('/back/tag/update',params,'POST');
}
export function deleteTag(params){
    return request('/back/tag/delete',params,'POST');
}
export function getTagAll(params){
    return request('/back/tag/all',params,'GET');
}