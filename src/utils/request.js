// src/utils/request.js
import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';

console.log('Base API URL:', process.env.VUE_APP_BASE_API);

// 创建 Axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基础URL
  timeout: 5000 // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 如果存在 token，则添加到 Authorization 头
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error(error); // 打印请求错误
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;

    // 判断后端是否返回 code，并按需判断是否成功
    if (res.code && res.code !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      });
      return Promise.reject(new Error(res.message || 'Error'));
    }

    // 返回成功数据
    return res;
  },
  error => {
    console.error('err' + error); // 打印错误

    if (error.response) {
      // 处理 HTTP 错误响应
      switch (error.response.status) {
        case 401:
          // Token 过期或无效
          MessageBox.confirm(
            '您已登出，可以取消以留在该页面，或者重新登录',
            '确认登出',
            {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            store.dispatch('user/logout').then(() => {
              location.reload(); // 重新加载页面
            });
          });
          break;
        case 403:
          // 没有权限
          Message({
            message: '没有权限，请联系管理员',
            type: 'error',
            duration: 5 * 1000
          });
          break;
        default:
          Message({
            message: error.response.data.message || '未知错误',
            type: 'error',
            duration: 5 * 1000
          });
      }
    } else {
      // 处理其他类型的错误
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      });
    }

    return Promise.reject(error);
  }
);

export default service;