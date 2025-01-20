import axios from "axios";
import store from '@/store'
// 设置 Axios 基础 URL
axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:8080';

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 从 localStorage 或 Vuex 获取 token
    const token = localStorage.getItem("token") || store.getters.token;
    // 打印获取到的 token 日志
    console.log("获取到的 token:", token);
    if (token) {
      // 将 token 添加到请求头中
      config.headers["X-Token"] = token; // 或者 "Authorization": `Bearer ${token}`
      console.log("Request Headers:", config.headers); // 打印请求头
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器（如果需要）
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // 处理错误，比如 token 过期的情况
    if (error.response.status === 401) {
      // Token 过期或未授权的处理
      console.error("未授权，请登录！");
    }
    return Promise.reject(error);
  }
);

export default axios;
