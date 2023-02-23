import {request} from "../utils/request";

export function addArticle(params){
    return request('/back/article/add',params,'POST');
}
export function addArticleImg(params){
    return request('/back/article/add_image',params,'POST');
}
export function addArticleVideo(params){
    return request('/back/article/add_video',params,'POST');
}
export function getArticleList(params){
    return request('/back/article/list',params,'GET');
}
export function getArticle(params){
    return request('/back/article',params,'GET');
}
export function updateArticle(params){
    return request('/back/article/update',params,'POST');
}
export function deleteArticle(params){
    return request('/back/article/delete',params,'POST');
}
export function searchArticle(params){
    return request('/back/article/search',params,'GET');
}