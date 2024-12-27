<template>
    <div class="log-container">
      <h2>流程日志</h2>
      <div v-for="(log, index) in logs" :key="index" class="log-item">
        <p>{{ log.timestamp }}: {{ log.message }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        logs: [
          { timestamp: '2024-12-01 10:00', message: '流程开始' },
          { timestamp: '2024-12-01 10:30', message: '审批人批准流程' },
          { timestamp: '2024-12-01 11:00', message: '流程结束' },
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  .log-container {
    padding: 20px;
  }
  .log-item {
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
  }
  </style>
  