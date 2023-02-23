import {request} from "../utils/request";

export function getCommentList(params){
    return request("/back/article/comment/list",params,'GET');
}
export function addComment(params){
    return request("/back/article/comment/add",params,'POST');
}
export function deleteComment(params){
    return request("/back/article/comment/delete",params,'POST');
}
export function searchComment(params){
    return request('/back/article/comment/search',params,'GET');
}