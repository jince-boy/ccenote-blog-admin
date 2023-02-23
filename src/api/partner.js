import {request} from "../utils/request";

export function getPartnerList(params){
    return request('/back/partner/list',params,'GET');
}
export function getPartner(params){
    return request('/back/partner',params,'GET');
}
export function addPartner(params){
    return request('/back/partner/add',params,'POST');
}
export function updatePartner(params){
    return request('/back/partner/update',params,'POST');
}
export function deletePartner(params){
    return request('/back/partner/delete',params,'POST');
}