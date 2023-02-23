import {request} from "../utils/request";

export function getConfig(params){
    return request('/back/config',params,'GET');
}
export function updateConfig(params){
    return request('/back/config/update',params,'POST');
}
export function setLogo(params){
    return request('/back/config/update/logo',params,'POST');
}
export function getKeyword(params){
    return request('/back/config/comment',params,'GET');
}
export function setKeyword(params){
    return request('/back/config/comment/set',params,'POST');
}