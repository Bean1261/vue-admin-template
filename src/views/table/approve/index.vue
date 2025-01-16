// Frontend: Vue.js Component
<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="我的提交" name="mySubmissions">
            <el-table :data="mySubmissions" border style="width: 100%; margin-top: 20px;">
              <el-table-column prop="id" label="编号" width="80" />
              <el-table-column prop="title" label="标题" />
              <el-table-column prop="current_user_phone" label="提交人" />
              <el-table-column prop="status" label="状态" />
              <el-table-column label="操作" width="200">
                <template #default="scope">
                  <el-button size="small" type="primary" @click="viewDetails(scope.row)">查看详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="待审批" name="pendingApprovals">
            <el-table :data="pendingApprovals" border style="width: 100%; margin-top: 20px;">
              <el-table-column prop="id" label="编号" width="80" />
              <el-table-column prop="title" label="标题" />
              <el-table-column prop="current_user_phone" label="提交人" />
              <el-table-column prop="status" label="状态" />
              <el-table-column label="操作" width="200">
                <template #default="scope">
                  <el-button size="small" type="primary" @click="approve(scope.row)">审批</el-button>
                  <el-button size="small" type="danger" @click="reject(scope.row)">拒绝</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="已审批" name="approved">
            <el-table :data="approvedRecords" border style="width: 100%; margin-top: 20px;">
              <el-table-column prop="id" label="编号" width="80" />
              <el-table-column prop="title" label="标题" />
              <el-table-column prop="current_user_phone" label="提交人" />
              <el-table-column prop="status" label="状态" />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <!-- Approval Dialog -->
    <el-dialog title="审批" :visible.sync="approvalDialogVisible" width="500px">
      <el-form :model="selectedRecord" label-width="120px">
        <el-form-item label="审批人">
          <el-input v-model="selectedRecord.assessmentPerson" :disabled="true" />
        </el-form-item>
        <el-form-item label="下一审批人">
          <el-input v-model="selectedRecord.final_reviewer" :placeholder="'请输入下一审批人'" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="approveRecord">通过</el-button>
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
      activeTab: 'mySubmissions',
      mySubmissions: [],
      pendingApprovals: [],
      approvedRecords: [],
      approvalDialogVisible: false,
      selectedRecord: {}
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      axios.get('/api/ledger/getApprovals')
        .then(response => {
          this.mySubmissions = response.data.mySubmissions;
          this.pendingApprovals = response.data.pendingApprovals;
          this.approvedRecords = response.data.approvedRecords;
        })
        .catch(error => {
          console.error('There was an error fetching the data!', error);
        });
    },
    viewDetails(row) {
      this.$router.push({ name: 'SubmissionDetails', params: { id: row.id } });
    },
    approve(row) {
      this.selectedRecord = row;
      this.approvalDialogVisible = true;
    },
    reject(row) {
      this.selectedRecord = row;
      this.approvalDialogVisible = true;
    },
    approveRecord() {
      axios.post('/api/ledger/approve', this.selectedRecord)
        .then(response => {
          this.fetchData();
          this.approvalDialogVisible = false;
        })
        .catch(error => {
          console.error('There was an error approving the record!', error);
        });
    },
    rejectRecord() {
      axios.post('/api/ledger/reject', this.selectedRecord)
        .then(response => {
          this.fetchData();
          this.approvalDialogVisible = false;
        })
        .catch(error => {
          console.error('There was an error rejecting the record!', error);
        });
    }
  }
};
</script>
