import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: 'http://127.0.0.1:8080', // 设置基地址为后端服务地址
  withCredentials: true, // 如果需要跨域携带 cookie，可以启用此项
  timeout: 5000 // 请求超时时间
})

// request interceptor
service.interceptors.request.use(
  config => {
    // 请求发送前的处理
    if (store.getters.token) {
      // 为每个请求携带 token，按实际情况修改
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // 请求错误处理
    console.log(error) // 调试用
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data

    // 自定义状态码不是 20000 时认为失败
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 针对特定错误码的处理（例如登录过期）
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm('您已注销，可以取消以留在此页面，或重新登录', '确认注销', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // 调试用
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
