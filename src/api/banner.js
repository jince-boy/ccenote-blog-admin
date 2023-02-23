import {request} from "../utils/request";

export function getBannerList(params){
    return request('/back/banner/list',params,'GET');
}
export function getBanner(params){
    return request('/back/banner',params,'GET');
}
export function addBanner(params){
    return request('/back/banner/add',params,'POST');
}
export function updateBanner(params){
    return request('/back/banner/update',params,'POST');
}
export function deleteBanner(params){
    return request('/back/banner/delete',params,'POST');
}