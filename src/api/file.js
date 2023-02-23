import {request} from "../utils/request";

export function getFileList(params){
    return request('/back/file',params,'GET');
}
export function uploadFile(params){
    return request('/back/file/upload',params,'POST');
}
export function deleteFile(params){
    return request('/back/file/delete',params,'POST');
}