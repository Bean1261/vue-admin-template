<template>
    <div class="approval-container">
      <h2>流程审批</h2>
      <div class="workflow-box">
        <div v-for="(node, index) in flowNodes" :key="node.id" :class="['node', node.status]">
          <span>{{ node.name }}</span>
          <div v-if="node.status === 'pending'">
            <button @click="approveNode(index)">批准</button>
            <button @click="rejectNode(index)">拒绝</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        flowNodes: [
          { id: 1, name: '开始', status: 'approved' },
          { id: 2, name: '审批', status: 'pending' },
          { id: 3, name: '结束', status: 'pending' },
        ],
      };
    },
    methods: {
      approveNode(index) {
        this.flowNodes[index].status = 'approved';
        console.log(`批准节点: ${this.flowNodes[index].name}`);
      },
      rejectNode(index) {
        this.flowNodes[index].status = 'rejected';
        console.log(`拒绝节点: ${this.flowNodes[index].name}`);
      },
    },
  };
  </script>
  
  <style scoped>
  .workflow-box {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .node {
    padding: 10px;
    background-color: #fff;
    border: 1px solid #ccc;
    text-align: center;
  }
  .node.approved {
    background-color: #c8e6c9;
  }
  .node.rejected {
    background-color: #ffccbc;
  }
  .node.pending {
    background-color: #fff3e0;
  }
  button {
    margin-top: 10px;
    padding: 5px 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
  }
  button:hover {
    background-color: #45a049;
  }
  </style>
  