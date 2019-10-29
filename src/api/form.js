
import axios from "axios";
import {host} from "./conifg";


let uploadHost = host+`/dd/image/upload`;
let uploadFileHost = host+`/dd/file/upload`;
 
const instance = axios.create({
    baseURL:host
})
instance.interceptors.response.use(function (response) {
    return response.data;
}, function (error) {
    // console.log(error);
    return Promise.reject(error);
});

function getTemplate(flowTypeId,cuid) {
    return instance.get(`/dd/api/form/load?flowTypeId=${flowTypeId}&cuid=${cuid}`)
}

function submit (data,flowTypeId,cuid){
    return instance.post(`/dd/api/form/submit?flowTypeId=${flowTypeId}&cuid=${cuid}`, data)
}

function getProjetcByAd(url){
    // console.log(url);
    return instance.get(url)
}

export {
    getTemplate,
    submit,
    // getAllAd,
    getProjetcByAd,
    uploadHost,
    uploadFileHost
}