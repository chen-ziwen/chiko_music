import axios, { type AxiosRequestConfig } from "axios";
import { isDev } from '../mode';
interface API {
    get<T>(url: string, params?: any): Promise<T>
    post<T>(url: string, params?: any): Promise<T>
}

const baseURl = isDev ? 'http://localhost:3000/' : 'http://api.music.chiko.website';

const instance = axios.create({
    baseURL: baseURl,   // 默认请求地址
    timeout: 8000, // 请求超时八秒
    withCredentials: true, // 让cookie可以跨域请求
    // params: { realIP: "58.23.138.35" }, // 添加公共的参数,就是每个接口都需要的参数
});

instance.interceptors.request.use(
    function (config: AxiosRequestConfig) {
        // request拦截器 可以拿到请求报文，然后给请求标头设置Authorization(授权)为token值，这样每次请求都会带上这个token用于服务器验证身份。
        // config.headers.Authorization = window.sessionStorage.getItem('token'); // 将token加入到请求头
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    function (response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        }
        else if (response.status >= 300 && response.status < 400) {
        }
        else if (response.status >= 400) {
            return Promise.reject(response)
        }
    },
    function (error) {
        return Promise.reject(error);
    }
);

const http: API = {
    get: function (url, params) {
        return new Promise((resolve, reject) => {
            instance.get(url, { params: params }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err.data)
            })
        })
    },
    post: function (url, params) {
        return new Promise((resolve, reject) => {
            instance.post(url, params).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err.data)
            })
        })
    }
}

export default http;