<template>
  <div>
    <!-- 搜索框 -->
    <el-row>
      <el-col :span="24">
        <el-card>
          <el-row gutter="20" align="middle">
            <!-- 搜索关键字 -->
            <el-col :span="8">
              <el-input v-model="searchKeyword" placeholder="请输入关键字搜索" clearable></el-input>
              <el-tooltip content="请输入检查类型、负责人等关键字进行搜索" placement="top">
                <i
                  class="el-icon-question"
                  style="position: absolute; top: 50%; right: -20px; transform: translateY(-50%); cursor: pointer; color: #409EFF;"
                ></i>
              </el-tooltip>
            </el-col>

            <!-- 检查时间查询 -->
            <el-col :span="3" style="text-align: right; line-height: 36px;">
              检查时间：
            </el-col>
            <el-col :span="5">
              <el-date-picker
                v-model="startTime"
                type="date"
                placeholder="开始日期"
                style="width: 100%;"
              />
            </el-col>
            <el-col :span="5">
              <el-date-picker
                v-model="endTime"
                type="date"
                placeholder="结束日期"
                style="width: 100%;"
              />
            </el-col>

            <!-- 查询按钮 -->
            <el-col :span="3">
              <el-button type="primary" @click="searchLedger" style="width: 100%;">查询</el-button>
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
      <el-table-column prop="id" label="编号" width="80" />
      <el-table-column prop="inspectionType" label="检查类型" />
      <el-table-column prop="checkTime" label="排查时间" :formatter="formatDate" />
      <el-table-column prop="rectificationDeadline" label="整改期限" :formatter="formatDate" />
      <el-table-column prop="hazardSeverity" label="隐患等级" />
      <el-table-column prop="issueCategory" label="问题大类" />
      <el-table-column prop="subCategory" label="问题子类" />
      <el-table-column prop="detailedCategory" label="详细分类" />
      <el-table-column prop="department" label="责任科室" />
      <el-table-column prop="hazardArea" label="隐患区域" />
      <el-table-column prop="personInCharge" label="责任人" />
      <el-table-column prop="subArea" label="子区域" />
      <el-table-column prop="detailedArea" label="详细区域" />
      <el-table-column prop="issueObject" label="问题对象" />
      <el-table-column prop="issueMode" label="问题模式" />
      <el-table-column prop="lValue" label="L值" />
      <el-table-column prop="eValue" label="E值" />
      <el-table-column prop="cValue" label="C值" />
      <el-table-column prop="dValue" label="D值" />
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
      <el-table-column prop="analysisAndMeasures" label="原因分析及整改措施" />
      <el-table-column prop="rectificationFinishTime" label="整改完成时间" :formatter="formatDate" />
      <el-table-column prop="assessmentPerson" label="考核人员编号" />
      <el-table-column prop="currentUserPhone" label="提交用户编号" />
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
        <el-form-item v-for="(value, key) in selectedLedger" :label="translateLabel(key)" :key="key">
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
              :src="getImageUrl(value)"
              style="width: 100px; height: 100px"
              fit="cover"
            />
            <span v-else>暂无照片</span>
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
      startTime: null, // 开始时间
      endTime: null, // 结束时间
      ledgerList: [],
      editDialogVisible: false,
      selectedLedger: {}, // 用于编辑的选中记录
    };
  },
  methods: {
    // 用于翻译字段名
    translateLabel(key) {
      const labels = {
        id: "编号",
        inspectionType: "检查类型",
        checkTime: "排查时间",
        rectificationDeadline: "整改期限",
        hazardSeverity: "隐患等级",
        issueCategory: "问题大类",
        subCategory: "问题子类",
        detailedCategory: "详细分类",
        department: "责任科室",
        hazardArea: "隐患区域",
        personInCharge: "责任人",
        subArea: "子区域",
        detailedArea: "详细区域",
        issueObject: "问题对象",
        issueMode: "问题模式",
        lValue: "L值",
        eValue: "E值",
        cValue: "C值",
        dValue: "D值",
        beforeRectificationPhotos: "整改前照片",
        afterRectificationPhotos: "整改后照片",
        issueDescription: "问题描述",
        analysisAndMeasures: "原因分析及整改措施",
        rectificationFinishTime: "整改完成时间",
        assessmentPerson: "考核人员编号",
        currentUserPhone: "提交用户编号",
      };
      return labels[key] || key; // 如果没有找到对应的翻译，返回原始字段名
    },

    // 格式化日期
    formatDate(row, column, cellValue) {
      if (!cellValue) return "-";
      const date = new Date(cellValue);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    },
    getImageUrl(path) {
        return `http://localhost:8080/api/ledger/image?path=${encodeURIComponent(path)}`;
    },
    // 查询功能
    searchLedger() {
      const params = {
        keyword: this.searchKeyword || '', // 确保 keyword 不为 null
        startTime: this.startTime || null, // 如果未选择时间，传递 null
        endTime: this.endTime || null,     // 如果未选择时间，传递 null
      };
      axios
          .get("/api/ledger", { params })
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
      this.$confirm("此操作将永久删除该隐患及相关照片, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
      })
          .then(() => {
              axios
                  .delete(`/api/ledger/${id}`)
                  .then(() => {
                      this.$message.success("删除成功");
                      this.searchLedger();
                  })
                  .catch((error) => {
                      this.$message.error("删除失败: " + error.message);
                  });
          })
          .catch(() => {
              this.$message.info("已取消删除");
          });
    }
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