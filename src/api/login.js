
import axios from "axios";
import {loginHost} from "./conifg";
const instance = axios.create({
    baseURL:loginHost
})
instance.interceptors.response.use(function (response) {
    // console.log(response);
    return response.data;
}, function (error) {
    // console.log(error);
    return Promise.reject(error);
});
export function login(values) {
    // console.log(values);
    return instance.post(`/login?username=${values.username}`, values)
}
export function logout(userId) {
    return instance.get(`/logout?cuid=${userId}`);
}