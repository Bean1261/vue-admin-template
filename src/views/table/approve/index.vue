<!-- 审批页面组件 -->
<template>
  <div>
    <!-- 行布局 -->
    <el-row>
      <!-- 列布局，占据24格 -->
      <el-col :span="24">
        <!-- 选项卡组件，绑定到activeTab -->
        <el-tabs v-model="activeTab">
          <!-- 我的提交选项卡 -->
          <el-tab-pane label="我的提交" name="mySubmissions">
            <!-- 表格组件，绑定到mySubmissions数据 -->
            <el-table :data="mySubmissions" border style="width: 100%; margin-top: 20px;">
              <!-- 表格列，显示编号 -->
              <el-table-column prop="id" label="编号" width="80" />
              <!-- 表格列，显示标题 -->
              <el-table-column prop="title" label="标题" />
              <!-- 表格列，显示提交人 -->
              <el-table-column prop="current_user_phone" label="提交人" />
              <!-- 表格列，显示状态 -->
              <el-table-column prop="status" label="状态" />
              <!-- 表格列，显示操作按钮 -->
              <el-table-column label="操作" width="200">
                <!-- 操作按钮模板 -->
                <template #default="scope">
                  <!-- 查看详情按钮，点击触发viewDetails方法 -->
                  <el-button size="small" type="primary" @click="viewDetails(scope.row)">查看详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <!-- 待审批选项卡 -->
          <el-tab-pane label="待审批" name="pendingApprovals">
            <!-- 表格组件，绑定到pendingApprovals数据 -->
            <el-table :data="pendingApprovals" border style="width: 100%; margin-top: 20px;">
              <!-- 表格列，显示编号 -->
              <el-table-column prop="id" label="编号" width="80" />
              <!-- 表格列，显示标题 -->
              <el-table-column prop="title" label="标题" />
              <!-- 表格列，显示提交人 -->
              <el-table-column prop="current_user_phone" label="提交人" />
              <!-- 表格列，显示状态 -->
              <el-table-column prop="status" label="状态" />
              <!-- 表格列，显示操作按钮 -->
              <el-table-column label="操作" width="200">
                <!-- 操作按钮模板 -->
                <template #default="scope">
                  <!-- 审批按钮，点击触发approve方法 -->
                  <el-button size="small" type="primary" @click="approve(scope.row)">审批</el-button>
                  <!-- 拒绝按钮，点击触发reject方法 -->
                  <el-button size="small" type="danger" @click="reject(scope.row)">拒绝</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <!-- 已审批选项卡 -->
          <el-tab-pane label="已审批" name="approved">
            <!-- 表格组件，绑定到approvedRecords数据 -->
            <el-table :data="approvedRecords" border style="width: 100%; margin-top: 20px;">
              <!-- 表格列，显示编号 -->
              <el-table-column prop="id" label="编号" width="80" />
              <!-- 表格列，显示标题 -->
              <el-table-column prop="title" label="标题" />
              <!-- 表格列，显示提交人 -->
              <el-table-column prop="current_user_phone" label="提交人" />
              <!-- 表格列，显示状态 -->
              <el-table-column prop="status" label="状态" />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <!-- 审批对话框 -->
    <el-dialog title="审批" :visible.sync="approvalDialogVisible" width="500px">
      <!-- 表单组件，绑定到selectedRecord数据 -->
      <el-form :model="selectedRecord" label-width="120px">
        <!-- 审批人表单项 -->
        <el-form-item label="审批人">
          <!-- 输入框，绑定到selectedRecord.assessmentPerson，禁用状态 -->
          <el-input v-model="selectedRecord.assessmentPerson" :disabled="true" />
        </el-form-item>
        <!-- 下一审批人表单项 -->
        <el-form-item label="下一审批人">
          <!-- 输入框，绑定到selectedRecord.final_reviewer，占位符提示 -->
          <el-input v-model="selectedRecord.final_reviewer" :placeholder="'请输入下一审批人'" />
        </el-form-item>
        <!-- 表单按钮组 -->
        <el-form-item>
          <!-- 通过按钮，点击触发approveRecord方法 -->
          <el-button type="primary" @click="approveRecord">通过</el-button>
          <!-- 拒绝按钮，点击触发rejectRecord方法 -->
          <el-button type="danger" @click="rejectRecord">拒绝</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      // 当前激活的选项卡
      activeTab: 'mySubmissions',
      // 我的提交列表数据
      mySubmissions: [],
      // 待审批列表数据
      pendingApprovals: [],
      // 已审批列表数据
      approvedRecords: [],
      // 审批对话框是否可见
      approvalDialogVisible: false,
      // 当前选中的记录
      selectedRecord: {}
    };
  },
  mounted() {
    // 组件挂载后，调用fetchData方法获取数据
    this.fetchData();
  },
  methods: {
    // 获取数据的方法
    fetchData() {
      axios.get('/api/ledger/getApprovals')
        .then(response => {
          // 将获取到的数据分别赋值给相应的数组
          this.mySubmissions = response.data.mySubmissions;
          this.pendingApprovals = response.data.pendingApprovals;
          this.approvedRecords = response.data.approvedRecords;
        })
        .catch(error => {
          // 捕获并打印错误信息
          console.error('There was an error fetching the data!', error);
        });
    },
    // 查看详情方法，跳转到详情页面
    viewDetails(row) {
      this.$router.push({ name: 'SubmissionDetails', params: { id: row.id } });
    },
    // 审批方法，打开审批对话框
    approve(row) {
      this.selectedRecord = row;
      this.approvalDialogVisible = true;
    },
    // 拒绝方法，打开审批对话框
    reject(row) {
      this.selectedRecord = row;
      this.approvalDialogVisible = true;
    },
    // 通过审批方法，提交审批记录
    approveRecord() {
      axios.post('/api/ledger/approve', this.selectedRecord)
        .then(response => {
          // 提交成功后，重新获取数据并关闭对话框
          this.fetchData();
          this.approvalDialogVisible = false;
        })
        .catch(error => {
          // 捕获并打印错误信息
          console.error('There was an error approving the record!', error);
        });
    },
    // 拒绝审批方法，提交拒绝记录
    rejectRecord() {
      axios.post('/api/ledger/reject', this.selectedRecord)
        .then(response => {
          // 提交成功后，重新获取数据并关闭对话框
          this.fetchData();
          this.approvalDialogVisible = false;
        })
        .catch(error => {
          // 捕获并打印错误信息
          console.error('There was an error rejecting the record!', error);
        });
    }
  }
};
</script>
