import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api', // 通过代理转发请求
  headers: {
    'Content-Type': 'application/json'
  }
})

export default apiClient
