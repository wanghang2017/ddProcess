
import axios from "axios";
import {host} from "./conifg";
const instance = axios.create({
    baseURL:host
})
instance.interceptors.response.use(function (response) {
    return response.data;
}, function (error) {
    // console.log(error);
    return Promise.reject(error);
});

function getMenu(cuid) {
    return instance.get(`/dd//api/form/flowtype?cuid=${cuid}`)
}

export {
    getMenu
}