<template>
  <div class="ledger-management">
    <!-- 标题 -->
    <div class="content">
      <h1>燃气动力公司安全生产隐患排查治理台账</h1>
    </div>

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
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="80%">
      <el-form ref="ledgerForm" :model="ledgerForm" label-width="120px" @submit.prevent="handleSubmit">
        <!-- 表单内容 -->
        <div v-for="(field, index) in formFields" :key="index" class="form-row">
          <el-form-item v-if="field.type !== 'upload'" :label="field.label" :prop="field.prop">
            <template v-if="field.type === 'input'">
              <el-input v-model="ledgerForm[field.prop]" :placeholder="field.placeholder" :type="field.inputType || 'text'" />
            </template>
            <template v-else-if="field.type === 'select'">
              <el-select v-model="ledgerForm[field.prop]" :placeholder="field.placeholder">
                <el-option v-for="option in field.options" :key="option.value" :label="option.label" :value="option.value" />
              </el-select>
            </template>
            <template v-else-if="field.type === 'date'">
              <el-date-picker v-model="ledgerForm[field.prop]" type="date" :placeholder="field.placeholder" />
            </template>
            <template v-else-if="field.type === 'switch'">
              <el-switch v-model="ledgerForm[field.prop]" />
            </template>
          </el-form-item>
          <el-form-item v-else>
            <el-upload
              action="/upload"
              list-type="picture-card"
              :on-success="handlePictureSuccess"
              :before-upload="beforeUpload"
            >
              <el-button>点击上传</el-button>
            </el-upload>
          </el-form-item>
        </div>
      </el-form>
      <!-- 表单提交 -->
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '', // 搜索查询条件
      ledgerData: [], // 隐患台账数据
      ledgerForm: {
        inspectionType: '',
        checkTime: '',
        rectificationDeadline: '',
        hazardSeverity: '',
        issueCategory: '',
        subCategory: '',
        detailedCategory: '',
        department: '',
        hazardArea: '',
        personInCharge: '',
        subArea: '',
        detailedArea: '',
        issueObject: '',
        issueMode: '',
        lValue: '',
        eValue: '',
        cValue: '',
        dValue: '',
        beforeRectificationPhoto: '',
        issueDescription: '',
        isFirstDiscovery: false,
        teamLeader: '',
        deductionScore: '',
        inspector: '',
        afterRectificationPhoto: '',
        analysisAndMeasures: '',
        rectificationFinishTime: '',
        assessmentPerson: '',
        assessmentAmount: ''
      },
      dialogVisible: false,
      dialogTitle: '新增隐患',
      formFields: [
        { label: '巡查类型', prop: 'inspectionType', type: 'input', placeholder: '请输入巡查类型' },
        { label: '排查时间', prop: 'checkTime', type: 'date', placeholder: '选择排查时间' },
        { label: '限期整改时间', prop: 'rectificationDeadline', type: 'date', placeholder: '选择限期整改时间' },
        { label: '隐患严重程度', prop: 'hazardSeverity', type: 'select', placeholder: '选择隐患严重程度', options: [
          { label: '轻微', value: '轻微' },
          { label: '中等', value: '中等' },
          { label: '严重', value: '严重' }
        ]},
        { label: '问题大类', prop: 'issueCategory', type: 'input', placeholder: '请输入问题大类' },
        { label: '问题子类', prop: 'subCategory', type: 'input', placeholder: '请输入问题子类' },
        { label: '详细分类', prop: 'detailedCategory', type: 'input', placeholder: '请输入详细分类' },
        { label: '责任科室', prop: 'department', type: 'input', placeholder: '请输入责任科室' },
        { label: '隐患区域', prop: 'hazardArea', type: 'input', placeholder: '请输入隐患区域' },
        { label: '责任人', prop: 'personInCharge', type: 'input', placeholder: '请输入责任人' },
        { label: '问题对象', prop: 'issueObject', type: 'input', placeholder: '请输入问题对象' },
        { label: '问题模式', prop: 'issueMode', type: 'input', placeholder: '请输入问题模式' },
        { label: 'L值', prop: 'lValue', type: 'input', placeholder: '请输入L值', inputType: 'number' },
        { label: 'E值', prop: 'eValue', type: 'input', placeholder: '请输入E值', inputType: 'number' },
        { label: 'C值', prop: 'cValue', type: 'input', placeholder: '请输入C值', inputType: 'number' },
        { label: 'D值', prop: 'dValue', type: 'input', placeholder: '请输入D值', inputType: 'number' },
        { label: '整改前照片', prop: 'beforeRectificationPhoto', type: 'upload' },
        { label: '问题描述', prop: 'issueDescription', type: 'input', placeholder: '请输入问题描述', inputType: 'textarea' },
        { label: '是否首次发现', prop: 'isFirstDiscovery', type: 'switch' },
        { label: '扣分值', prop: 'deductionScore', type: 'input', placeholder: '请输入扣分值', inputType: 'number' },
        { label: '区域班组长', prop: 'teamLeader', type: 'input', placeholder: '请输入区域班组长'},
        { label: '检查人', prop: 'inspector', type: 'input', placeholder: '请输入检查人' },
        { label: '整改后照片', prop: 'afterRectificationPhoto', type: 'upload' },
        { label: '原因分析及整改措施', prop: 'analysisAndMeasures', type: 'input', placeholder: '请输入原因分析及整改措施', inputType: 'textarea' },
        { label: '整改完成时间', prop: 'rectificationFinishTime', type: 'date', placeholder: '选择整改完成时间' },
        { label: '考核人员', prop: 'assessmentPerson', type: 'input', placeholder: '请输入考核人员' },
        { label: '考核金额', prop: 'assessmentAmount', type: 'input', placeholder: '请输入考核金额', inputType: 'number' }
        // 可继续添加其他字段
      ]
    };
  },
  methods: {
    handleSearch() {
      // 搜索逻辑
    },
    openAddDialog() {
      this.dialogTitle = '新增隐患';
      this.resetForm();
      this.dialogVisible = true;
    },
    resetForm() {
      this.ledgerForm = {
        inspectionType: '',
        checkTime: '',
        rectificationDeadline: '',
        hazardSeverity: '',
        issueCategory: '',
        subCategory: '',
        detailedCategory: '',
        department: '',
        hazardArea: '',
        personInCharge: '',
        subArea: '',
        detailedArea: '',
        issueObject: '',
        issueMode: '',
        lValue: '',
        eValue: '',
        cValue: '',
        dValue: '',
        beforeRectificationPhoto: '',
        issueDescription: '',
        isFirstDiscovery: false,
        teamLeader: '',
        deductionScore: '',
        inspector: '',
        afterRectificationPhoto: '',
        analysisAndMeasures: '',
        rectificationFinishTime: '',
        assessmentPerson: '',
        assessmentAmount: ''
      };
    },
    handleSubmit() {
      console.log('提交的表单数据：', this.ledgerForm);
    },
    handlePictureSuccess(response, file, fileList) {
      console.log('图片上传成功：', file.name);
    },
    beforeUpload(file) {
      return true;
    }
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
