import axios, { type AxiosRequestConfig } from "axios";
// import { ElMessage } from 'element-plus';
// import { useRouter } from "vue-router";
interface API {
    // Promise的泛型T代表promise变成成功态之后resolve的值，也就是请求到的数据的类型.
    //get函数<T>的这个T 类似于声明有一个泛型，必须写.
    get<T>(url: string, params?: any): Promise<T> //<T> 表示promise请求到的数据类型.
    post<T>(url: string, params?: any): Promise<T>
}
// const router = useRouter();
const instance = axios.create({
    baseURL: "http://localhost:3000",  //'https://chiko-music.vercel.app', //默认地址
    timeout: 5000, //请求超时五秒
    // params: { realIP: "58.23.138.35" }, // 添加公共的参数,就是每个接口都需要的参数
});

instance.interceptors.request.use(
    function (config: AxiosRequestConfig) {
        return config;
    },
    function (error) {
        // ElMessage.error({ message: '请求超时,请稍后进行尝试！' })
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    function (response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        }
        else if (response.status >= 300 && response.status < 400) {
            // ElMessage({
            //     message: '请登陆账号，再进行后续操作',
            //     type: 'warning',
            // });
            // router.replace({ path: 'login' })
        }
        else if (response.status >= 400) {
            // ElMessage.error({ message: '请求失败，请确认网络连接是否正常！' })
            return Promise.reject(response)
        }
        // return response;
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