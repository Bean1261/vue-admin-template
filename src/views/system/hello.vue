<template>
  <div>
    <h1>{{ message }}</h1>
    <button @click="fetchMessage">Get Message</button>
  </div>
</template>

<script>
import apiClient from '@/api/apiClient' // 引入 Axios 实例

export default {
  data() {
    return {
      message: ''
    }
  },
  methods: {
    async fetchMessage() {
      try {
        const response = await apiClient.get('/hello')
        this.message = response.data // 将接口返回的数据赋值给 message
      } catch (error) {
        console.error('Error fetching message:', error)
      }
    }
  }
}
</script>
