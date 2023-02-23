import {request} from "../utils/request";

export function getWebData(params){
    return request('/back/home',params,'GET');
}