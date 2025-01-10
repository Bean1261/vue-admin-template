<template>
    <div>
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="24">
          <el-card>
            <el-row>
              <el-col :span="8">
                <el-input v-model="searchKeyword" placeholder="请输入关键词搜索" clearable></el-input>
              </el-col>
              <el-col :span="4" class="ml-10">
                <el-button type="primary" @click="searchLedger">查询</el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
  
      <!-- 数据表格 -->
      <el-table
        :data="ledgerList"
        border
        style="width: 100%; margin-top: 20px"
      >
        <!-- 表格列 -->
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column prop="inspectionType" label="检查类型" />
        <el-table-column prop="checkTime" label="检查时间" />
        <el-table-column prop="rectificationDeadline" label="整改期限" />
        <el-table-column prop="hazardSeverity" label="隐患等级" />
        <el-table-column prop="issueCategory" label="问题类别" />
        <el-table-column label="整改前照片">
        <template #default="scope">
          <el-image
            v-if="scope.row.beforeRectificationPhotos"
            :src="getImageUrl(scope.row.beforeRectificationPhotos)"
            style="width: 100px; height: 100px"
            fit="cover"
          />
          <span v-else>暂无照片</span>
        </template>
        </el-table-column>
        <el-table-column label="整改后照片">
        <template #default="scope">
          <el-image
            v-if="scope.row.afterRectificationPhotos"
            :src="getImageUrl(scope.row.afterRectificationPhotos)"
            style="width: 100px; height: 100px"
            fit="cover"
          />
          <span v-else>暂无照片</span>
        </template>
        </el-table-column>
        <el-table-column prop="issueDescription" label="问题描述" />
        <el-table-column prop="rectificationFinishTime" label="整改完成时间" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="editLedger(scope.row)"
            >编辑</el-button>
            <el-button
              size="small"
              type="danger"
              @click="deleteLedger(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 编辑对话框 -->
      <el-dialog
        :visible.sync="editDialogVisible"
        title="编辑隐患数据"
        width="60%"
      >
        <el-form :model="selectedLedger" label-width="120px">
          <!-- 循环生成表单字段 -->
          <el-form-item v-for="(value, key) in selectedLedger" :label="key" :key="key">
            <template v-if="key === 'checkTime' || key === 'rectificationDeadline' || key === 'rectificationFinishTime'">
              <el-date-picker
                v-model="selectedLedger[key]"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </template>
            <template v-else-if="key === 'beforeRectificationPhotos' || key === 'afterRectificationPhotos'">
              <el-image
                v-if="value"
                :src="value"
                style="width: 100px; height: 100px"
                fit="cover"
              />
              <el-input v-model="selectedLedger[key]" placeholder="请输入图片路径或上传" />
            </template>
            <template v-else>
              <el-input v-model="selectedLedger[key]" />
            </template>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveLedger">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        searchKeyword: "",
        ledgerList: [],
        editDialogVisible: false,
        selectedLedger: {}, // 用于编辑的选中记录
      };
    },
    methods: {
        getImageUrl(path) {
            return `http://localhost:8080/api/ledger/image?path=${encodeURIComponent(path)}`;
        },
        // 查询功能
        searchLedger() {
            axios
            .get("/api/ledger", { params: { keyword: this.searchKeyword } })
            .then((response) => {
                this.ledgerList = response.data;
            })
            .catch((error) => {
                this.$message.error("查询失败: " + error.message);
            });
        },
        // 打开编辑对话框
        editLedger(row) {
            this.selectedLedger = { ...row };
            this.editDialogVisible = true;
        },
        // 保存编辑内容
        saveLedger() {
            axios
            .post("/api/ledger/save", this.selectedLedger)
            .then(() => {
                this.$message.success("保存成功");
                this.editDialogVisible = false;
                this.searchLedger();
            })
            .catch((error) => {
                this.$message.error("保存失败: " + error.message);
            });
        },
        // 删除功能
        deleteLedger(id) {
            axios
            .delete(`/api/ledger/${id}`)
            .then(() => {
                this.$message.success("删除成功");
                this.searchLedger();
            })
            .catch((error) => {
                this.$message.error("删除失败: " + error.message);
            });
        },
    },
    mounted() {
      this.searchLedger();
    },
  };
  </script>
  
  <style scoped>
  .ml-10 {
    margin-left: 10px;
  }
  </style>
  