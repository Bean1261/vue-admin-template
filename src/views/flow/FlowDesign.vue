<template>
  <div>
    <!-- Header section -->
    <div class="workflow-header">
      <h2>流程设计</h2>
      <button @click="saveFlow">保存流程</button>
    </div>

    <!-- Workflow Container -->
    <div class="workflow-container" ref="workflowContainer">
      <!-- Nodes -->
      <div
        class="node"
        v-for="(node, index) in nodes"
        :key="node.id"
        :style="{ top: `${node.y}px`, left: `${node.x}px` }"
        @mousedown="startDrag(index, $event)"
      >
        <div class="node-content">
          <span>{{ node.name }}</span>
        </div>
      </div>

      <!-- Connection Lines -->
      <div
        class="connection-line"
        v-for="line in connections"
        :key="line.id"
        :style="lineStyle(line)"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nodes: [
        { id: 1, name: '开始', x: 100, y: 100 },
        { id: 2, name: '审批', x: 300, y: 100 },
        { id: 3, name: '结束', x: 500, y: 100 },
      ],
      connections: [
        { id: 1, from: 1, to: 2 },
        { id: 2, from: 2, to: 3 },
      ],
      isDragging: false,
      dragIndex: null,
      dragStartX: 0,
      dragStartY: 0,
      containerWidth: 600,
      containerHeight: 400,
    };
  },
  methods: {
    // Start dragging the node
    startDrag(index, event) {
      this.isDragging = true;
      this.dragIndex = index;
      this.dragStartX = event.clientX - this.nodes[index].x;
      this.dragStartY = event.clientY - this.nodes[index].y;
      window.addEventListener('mousemove', this.onDrag);
      window.addEventListener('mouseup', this.stopDrag);
    },

    // Drag the node and update its position
    onDrag(event) {
      if (this.isDragging && this.dragIndex !== null) {
        const node = this.nodes[this.dragIndex];
        let newX = event.clientX - this.dragStartX;
        let newY = event.clientY - this.dragStartY;

        // Ensure the node stays within the container boundaries
        newX = Math.max(0, Math.min(this.containerWidth - 100, newX));
        newY = Math.max(0, Math.min(this.containerHeight - 50, newY));

        node.x = newX;
        node.y = newY;
      }
    },

    // Stop dragging the node
    stopDrag() {
      this.isDragging = false;
      window.removeEventListener('mousemove', this.onDrag);
      window.removeEventListener('mouseup', this.stopDrag);
    },

    // Calculate and return the line style between two nodes
    lineStyle(line) {
      const fromNode = this.nodes.find(node => node.id === line.from);
      const toNode = this.nodes.find(node => node.id === line.to);
      const x1 = fromNode.x + 50; // Node's center X
      const y1 = fromNode.y + 25; // Node's center Y
      const x2 = toNode.x + 50; // Node's center X
      const y2 = toNode.y + 25; // Node's center Y
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y2 - y1);
      const rotation = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

      return {
        position: 'absolute',
        top: `${y1}px`,
        left: `${x1}px`,
        width: `${width}px`,
        height: '2px',
        backgroundColor: 'black',
        transform: `rotate(${rotation}deg)`,
        transformOrigin: '0 0',
      };
    },

    // Simulate saving the flow
    saveFlow() {
      console.log('保存流程:', this.nodes, this.connections);
      alert('流程已保存！');
    },
  },
};
</script>

<style scoped>
.workflow-header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #f4f4f4;
  border-bottom: 1px solid #ccc;
}

.workflow-container {
  position: relative;
  width: 600px;
  height: 400px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
}

.node {
  position: absolute;
  width: 100px;
  height: 50px;
  background-color: #fff;
  border: 1px solid #ccc;
  text-align: center;
  line-height: 50px;
  cursor: move;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.node-content span {
  display: block;
  font-weight: bold;
  color: #333;
}

.connection-line {
  position: absolute;
  background-color: black;
  z-index: -1;
}

button {
  padding: 6px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
