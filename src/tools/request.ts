import axios from 'axios'
import sha1 from 'sha1'

// 消息通知
import { useToast } from "vue-toastification"
const toast = useToast()

const request = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000
})

request.interceptors.request.use(function (config) {
    // 请求拦截器
    
    return config
}, function (error) {
    
    return Promise.reject(error)
})

request.interceptors.response.use(function (response) {
    // 响应拦截器
    const result = response.data
    if (result.code === 401) {
        // 未认证
    }
    if (result.code === 400) {
        // 请求错误
        toast.error("请求错误，请检查输入。")
    }
    if (result.code === 500) {
        // 服务器错误
        toast.error("这是我们的服务器问题，请放心，这并不是你的问题。")
        console.error(result.msg)
    }
    if (result.code === 403) {
        // 权限不足
        toast.error("权限不足，请勿尝试非法操作。")
    }
    if (result.code !== 200)
        // 其他错误
        return Promise.reject(response)
    return response

}, function (error) {

    return Promise.reject(error)
})

export default request