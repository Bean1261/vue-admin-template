<template>
  <div class="ledger-management">
    <!-- 搜索栏 -->
    <el-row :gutter="20" class="search-row">
      <el-col :span="8">
        <el-input
          v-model="searchQuery"
          placeholder="请输入问题大类或描述"
          clearable
          @input="handleSearch"
        ></el-input>
      </el-col>
      <el-col :span="16" class="text-right">
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="openAddDialog">新增隐患</el-button>
      </el-col>
    </el-row>

    <!-- 隐患台账列表 -->
    <el-table :data="filteredLedger" stripe border style="width: 100%">
      <el-table-column label="问题大类" prop="issueCategory" min-width="180"></el-table-column>
      <el-table-column label="隐患描述" prop="issueDescription" min-width="300"></el-table-column>
      <el-table-column label="整改完成时间" prop="rectificationFinishTime" min-width="180"></el-table-column>
      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button size="small" @click="openEditDialog(scope.row)" type="primary">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteLedger(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑隐患的对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="currentLedger" ref="ledgerForm" :rules="ledgerRules" label-width="120px">
        <el-form-item label="问题大类" prop="issueCategory">
          <el-input v-model="currentLedger.issueCategory" placeholder="请输入问题大类"></el-input>
        </el-form-item>
        <el-form-item label="隐患描述" prop="issueDescription">
          <el-input v-model="currentLedger.issueDescription" type="textarea" placeholder="请输入隐患描述"></el-input>
        </el-form-item>
        <el-form-item label="整改完成时间" prop="rectificationFinishTime">
          <el-date-picker v-model="currentLedger.rectificationFinishTime" type="date" placeholder="选择整改完成时间" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveLedger">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      // 示例数据
      ledgerData: [
        { id: 1, issueCategory: '设备故障', issueDescription: '电力设备老化导致停机', rectificationFinishTime: '2024-12-30' },
        { id: 2, issueCategory: '安全隐患', issueDescription: '消防设备未定期检查', rectificationFinishTime: '2024-12-15' },
        { id: 3, issueCategory: '操作错误', issueDescription: '操作员未按规范操作设备', rectificationFinishTime: '2024-12-20' }
      ],
      currentLedger: { id: null, issueCategory: '', issueDescription: '', rectificationFinishTime: '' },
      dialogVisible: false,
      dialogTitle: '新增隐患',
      ledgerRules: {
        issueCategory: [
          { required: true, message: '请输入问题大类', trigger: 'blur' }
        ],
        issueDescription: [
          { required: true, message: '请输入隐患描述', trigger: 'blur' }
        ],
        rectificationFinishTime: [
          { required: true, message: '请选择整改完成时间', trigger: 'blur' }
        ]
      },
      searchQuery: '', // 搜索查询条件
    };
  },
  computed: {
    // 计算属性，用于过滤隐患台账
    filteredLedger() {
      if (!this.searchQuery) {
        return this.ledgerData; // 如果没有搜索条件，返回所有隐患
      }
      return this.ledgerData.filter(ledger => {
        return ledger.issueCategory.includes(this.searchQuery) || ledger.issueDescription.includes(this.searchQuery);
      });
    }
  },
  methods: {
    // 处理搜索，点击搜索按钮或者输入时触发
    handleSearch() {
      // 计算属性已经处理了搜索逻辑
    },

    // 打开新增隐患对话框
    openAddDialog() {
      this.dialogTitle = '新增隐患';
      this.currentLedger = { id: null, issueCategory: '', issueDescription: '', rectificationFinishTime: '' }; // 清空表单
      this.dialogVisible = true;
    },

    // 打开编辑隐患对话框
    openEditDialog(ledger) {
      this.dialogTitle = '编辑隐患';
      this.currentLedger = { ...ledger }; // 填充表单数据
      this.dialogVisible = true;
    },

    // 保存隐患（新增或编辑）
    saveLedger() {
      this.$refs.ledgerForm.validate(valid => {
        if (valid) {
          if (this.currentLedger.id) {
            // 编辑隐患
            axios.put(`/api/ledger/${this.currentLedger.id}`, this.currentLedger)
              .then(() => {
                this.$message.success('隐患编辑成功');
                this.fetchLedger(); // 重新获取隐患台账
                this.dialogVisible = false;
              })
              .catch(() => {
                this.$message.error('隐患编辑失败');
              });
          } else {
            // 新增隐患
            axios.post('/api/ledger', this.currentLedger)
              .then(() => {
                this.$message.success('隐患新增成功');
                this.fetchLedger(); // 重新获取隐患台账
                this.dialogVisible = false;
              })
              .catch(() => {
                this.$message.error('隐患新增失败');
              });
          }
        }
      });
    },

    // 删除隐患
    deleteLedger(ledgerId) {
      this.$confirm('确定删除该隐患吗？', '提示', {
        type: 'warning'
      }).then(() => {
        axios.delete(`/api/ledger/${ledgerId}`)
          .then(() => {
            this.$message.success('隐患删除成功');
            this.fetchLedger(); // 重新获取隐患台账
          })
          .catch(() => {
            this.$message.error('隐患删除失败');
          });
      });
    },

    // 获取隐患台账（假设从API获取数据，当前为模拟数据）
    fetchLedger() {
      // 这里模拟获取数据
      // axios.get('/api/ledger')
      //   .then(response => {
      //     this.ledgerData = response.data;
      //   })
      //   .catch(error => {
      //     this.$message.error('获取隐患台账失败');
      //   });
    }
  },
  created() {
    this.fetchLedger(); // 页面加载时获取隐患台账
  }
};
</script>

<style scoped>
.ledger-management {
  padding: 20px;
}

.search-row {
  margin-bottom: 20px;
}

.text-right {
  text-align: right;
}

.dialog-footer {
  text-align: right;
}

.el-table {
  margin-top: 20px;
}

.el-table .el-button {
  margin-right: 10px;
}
</style>
