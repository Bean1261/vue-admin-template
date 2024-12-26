<template>
  <div class="ledger-form">
    <div class="content">
      <h1>燃气动力公司安全生产隐患排查治理台账</h1>
    </div>
    <el-form ref="ledgerForm" :model="ledgerForm" label-width="120px" @submit.prevent="handleSubmit">
      <div class="form-row">
        <el-form-item label="巡查类型">
          <el-input v-model="ledgerForm.inspectionType" placeholder="请输入巡查类型" />
        </el-form-item>

        <el-form-item label="排查时间">
          <el-date-picker v-model="ledgerForm.checkTime" type="date" placeholder="选择排查时间" />
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="限期整改时间">
          <el-date-picker v-model="ledgerForm.rectificationDeadline" type="date" placeholder="选择限期整改时间" />
        </el-form-item>

        <el-form-item label="隐患严重程度">
          <el-select v-model="ledgerForm.hazardSeverity" placeholder="选择隐患严重程度">
            <el-option label="轻微" value="轻微" />
            <el-option label="中等" value="中等" />
            <el-option label="严重" value="严重" />
          </el-select>
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="问题大类">
          <el-input v-model="ledgerForm.issueCategory" placeholder="请输入问题大类" />
        </el-form-item>

        <el-form-item label="问题子类">
          <el-input v-model="ledgerForm.subCategory" placeholder="请输入问题子类" />
        </el-form-item>

        <el-form-item label="详细分类">
          <el-input v-model="ledgerForm.detailedCategory" placeholder="请输入详细分类" />
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="责任科室">
          <el-input v-model="ledgerForm.department" placeholder="请输入责任科室" />
        </el-form-item>

        <el-form-item label="隐患区域">
          <el-input v-model="ledgerForm.hazardArea" placeholder="请输入隐患区域" />
        </el-form-item>

        <el-form-item label="责任人">
          <el-input v-model="ledgerForm.personInCharge" placeholder="请输入责任人" />
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="子区域">
          <el-input v-model="ledgerForm.subArea" placeholder="请输入子区域" />
        </el-form-item>

        <el-form-item label="详细区域">
          <el-input v-model="ledgerForm.detailedArea" placeholder="请输入详细区域" />
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="问题对象">
          <el-input v-model="ledgerForm.issueObject" placeholder="请输入问题对象" />
        </el-form-item>

        <el-form-item label="问题模式">
          <el-input v-model="ledgerForm.issueMode" placeholder="请输入问题模式" />
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="L值">
          <el-input v-model="ledgerForm.lValue" type="number" placeholder="请输入L值" />
        </el-form-item>

        <el-form-item label="E值">
          <el-input v-model="ledgerForm.eValue" type="number" placeholder="请输入E值" />
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="C值">
          <el-input v-model="ledgerForm.cValue" type="number" placeholder="请输入C值" />
        </el-form-item>

        <el-form-item label="D值">
          <el-input v-model="ledgerForm.dValue" type="number" placeholder="请输入D值" />
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="整改前照片">
          <el-upload
            action="/upload"
            list-type="picture-card"
            :on-success="handlePictureSuccess"
            :before-upload="beforeUpload"
          >
            <el-button>点击上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="问题描述">
          <el-input v-model="ledgerForm.issueDescription" type="textarea" placeholder="请输入问题描述" />
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="是否首次发现">
          <el-switch v-model="ledgerForm.isFirstDiscovery" />>
        </el-form-item>

        <el-form-item label="区域班组长">
          <el-input v-model="ledgerForm.teamLeader" placeholder="请输入区域班组长" />
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="扣分值">
          <el-input v-model="ledgerForm.deductionScore" type="number" placeholder="请输入扣分值" />
        </el-form-item>

        <el-form-item label="检查人">
          <el-input v-model="ledgerForm.inspector" placeholder="请输入检查人" />
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="整改后照片">
          <el-upload
            action="/upload"
            list-type="picture-card"
            :on-success="handlePictureSuccess"
            :before-upload="beforeUpload"
          >
            <el-button>点击上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="原因分析及整改措施">
          <el-input v-model="ledgerForm.analysisAndMeasures" type="textarea" placeholder="请输入原因分析及整改措施" />
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="整改完成时间">
          <el-date-picker v-model="ledgerForm.rectificationFinishTime" type="date" placeholder="选择整改完成时间" />
        </el-form-item>
      </div>

      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      ledgerForm: {
        inspectionType: '', // 默认值为空字符串
        checkTime: '', // 默认值为空
        rectificationDeadline: '',
        hazardSeverity: '轻微', // 设置默认值为“轻微”
        issueCategory: '未分类', // 默认值
        subCategory: '未分类',
        detailedCategory: '未分类',
        department: '未指定', // 默认值
        hazardArea: '未指定',
        personInCharge: '未分配', // 默认值
        subArea: '',
        detailedArea: '',
        issueObject: '',
        issueMode: '',
        lValue: 0, // 数字默认值为 0
        eValue: 0,
        cValue: 0,
        dValue: 0,
        beforeRectificationPhoto: '',
        issueDescription: '',
        isFirstDiscovery: false, // 默认值为 false
        teamLeader: '未指定',
        deductionScore: 0, // 数字默认值
        inspector: '未指定',
        afterRectificationPhoto: '',
        analysisAndMeasures: '未填写', // 默认说明
        rectificationFinishTime: '',
        assessmentPerson: '未分配',
        assessmentAmount: 0
      }
    }
  },
  methods: {
    handleSubmit() {
      // 在提交前补充默认值
      const defaultValues = {
        inspectionType: '未填写',
        checkTime: '',
        rectificationDeadline: '',
        hazardSeverity: '轻微',
        issueCategory: '未分类',
        subCategory: '未分类',
        detailedCategory: '未分类',
        department: '未指定',
        hazardArea: '未指定',
        personInCharge: '未分配',
        subArea: '',
        detailedArea: '',
        issueObject: '',
        issueMode: '',
        lValue: 0,
        eValue: 0,
        cValue: 0,
        dValue: 0,
        beforeRectificationPhoto: '',
        issueDescription: '未填写',
        isFirstDiscovery: false,
        teamLeader: '未指定',
        deductionScore: 0,
        inspector: '未指定',
        afterRectificationPhoto: '',
        analysisAndMeasures: '未填写',
        rectificationFinishTime: '',
        assessmentPerson: '未分配',
        assessmentAmount: 0
      };

      // 遍历补充默认值
      for (const key in defaultValues) {
        if (!this.ledgerForm[key]) {
          this.ledgerForm[key] = defaultValues[key];
        }
      }

      console.log('表单数据提交：', this.ledgerForm)
      // 提交表单逻辑
      axios.post('/api/ledger/add', this.ledgerForm)
        .then(response => {
          console.log('提交成功：', response.data);
          this.$message.success('提交成功！');
        })
        .catch(error => {
          console.error('Request failed:', error);
          if (error.response) {
            console.error('Error response:', error.response.data);
          } else if (error.request) {
            console.error('Error request:', error.request);
          } else {
            console.error('Error message:', error.message);
          }
        });
    },
    handlePictureSuccess(response, file, fileList) {
      // 处理上传成功的照片
    },
    beforeUpload(file) {
      // 上传前的验证逻辑
      return true;
    }
  }
}
</script>

<style scoped>
.form-row {
  display: flex;
  justify-content: space-between; /* 或者使用 space-around, space-evenly 等 */
  margin-bottom: 20px; /* 行间距 */
}
.form-row .el-form-item {
  flex: 1; /* 使每个表单项占据相同的宽度 */
  margin-right: 20px; /* 右侧间距 */
}
.form-row .el-form-item:last-child {
  margin-right: 0; /* 最后一个表单项不需要右侧间距 */
}
.content {
  display: flex;
  justify-content: center; /* 水平居中 */
}
.red-label .el-form-item__label {
  color: red;
}
.red-text .el-input__inner {
  color: red;
}
</style>
