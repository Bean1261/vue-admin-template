<template>
  <div class="ledger-form">
    <div class="content">
      <h1>燃气动力公司安全生产隐患排查治理台账</h1>
    </div>
    <el-form
      ref="ledgerForm"
      :model="ledgerForm"
      :rules="rules"
      label-width="120px"
    >
      <!-- 第一行 -->
      <div class="form-row">
        <el-form-item label="巡查类型" prop="inspectionType">
          <el-select v-model="ledgerForm.inspectionType" placeholder="选择隐患严重程度">
            <el-option label="试车巡逻" value="试车巡逻" />
            <el-option label="中等" value="中等" />
            <el-option label="严重" value="严重" />
          </el-select>
        </el-form-item>
        <el-form-item label="排查时间" prop="checkTime">
          <el-date-picker v-model="ledgerForm.checkTime" type="date" placeholder="选择排查时间" />
        </el-form-item>
      </div>
      <!-- 第二行 -->
      <div class="form-row">
        <el-form-item label="限期整改时间" prop="rectificationDeadline">
          <el-date-picker v-model="ledgerForm.rectificationDeadline" type="date" placeholder="选择限期整改时间" />
        </el-form-item>
        <el-form-item label="隐患严重程度" prop="hazardSeverity">
          <el-select v-model="ledgerForm.hazardSeverity" placeholder="选择隐患严重程度">
            <el-option label="轻微" value="轻微" />
            <el-option label="中等" value="中等" />
            <el-option label="严重" value="严重" />
          </el-select>
        </el-form-item>
      </div>
      <!-- 第三行 -->
      <div class="form-row">
        <el-form-item label="问题大类" prop="issueCategory">
          <el-input v-model="ledgerForm.issueCategory" placeholder="请输入问题大类" />
        </el-form-item>
        <el-form-item label="问题子类" prop="subCategory">
          <el-input v-model="ledgerForm.subCategory" placeholder="请输入问题子类" />
        </el-form-item>
      </div>
      <!-- 第四行 -->
      <div class="form-row">
        <el-form-item label="详细分类" prop="detailedCategory">
          <el-input v-model="ledgerForm.detailedCategory" placeholder="请输入详细分类" />
        </el-form-item>
        <el-form-item label="责任科室" prop="department">
          <el-input v-model="ledgerForm.department" placeholder="请输入责任科室" />
        </el-form-item>
      </div>
      <!-- 第五行 -->
      <div class="form-row">
        <el-form-item label="隐患区域" prop="hazardArea">
          <el-input v-model="ledgerForm.hazardArea" placeholder="请输入隐患区域" />
        </el-form-item>
        <el-form-item label="责任人" prop="personInCharge">
          <el-autocomplete
            v-model="ledgerForm.personInCharge"
            :fetch-suggestions="fetchUsernames"
            placeholder="请输入责任人"
            @select="handleSelectUser"
          >
            <template v-slot="{ item }">
              <div>
                <span>{{ item.name }}</span> - <span style="color: gray;">{{ item.phone }}</span>
              </div>
            </template>
          </el-autocomplete>
        </el-form-item>
      </div>
      <!-- 第六行 -->
      <div class="form-row">
        <el-form-item label="子区域" prop="subArea">
          <el-input v-model="ledgerForm.subArea" placeholder="请输入子区域" />
        </el-form-item>
        <el-form-item label="详细区域" prop="detailedArea">
          <el-input v-model="ledgerForm.detailedArea" placeholder="请输入详细区域" />
        </el-form-item>
      </div>
      <!-- 第七行 -->
      <div class="form-row">
        <el-form-item label="问题对象" prop="issueObject">
          <el-input v-model="ledgerForm.issueObject" placeholder="请输入问题对象" />
        </el-form-item>
        <el-form-item label="问题模式" prop="issueMode">
          <el-input v-model="ledgerForm.issueMode" placeholder="请输入问题模式" />
        </el-form-item>
      </div>
      <!-- 第八行 -->
      <div class="form-row">
        <el-form-item label="L值" prop="lValue">
          <el-input v-model="ledgerForm.lValue" type="number" placeholder="请输入L值" />
        </el-form-item>
        <el-form-item label="E值" prop="eValue">
          <el-input v-model="ledgerForm.eValue" type="number" placeholder="请输入E值" />
        </el-form-item>
      </div>
      <!-- 第九行 -->
      <div class="form-row">
        <el-form-item label="C值" prop="cValue">
          <el-input v-model="ledgerForm.cValue" type="number" placeholder="请输入C值" />
        </el-form-item>
        <el-form-item label="D值" prop="dValue">
          <el-input v-model="ledgerForm.dValue" type="number" placeholder="请输入D值" />
        </el-form-item>
      </div>
      <!-- 第十行 -->
      <div class="form-row">
        <el-form-item label="整改前照片">
          <el-upload
            action="/api/ledger/upload" 
            list-type="picture-card"
            :on-success="(response, file) => handlePictureSuccess(response, file, 'before')"
            :before-upload="beforeUpload"
            name="file"
          >
            <el-button>点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="问题描述" prop="issueDescription">
          <el-input v-model="ledgerForm.issueDescription" type="textarea" placeholder="请输入问题描述" />
        </el-form-item>
      </div>
      <!-- 第十一行 -->
      <div class="form-row">
      <!-- 修改整改后照片 -->
        <el-form-item label="整改后照片">
          <el-upload
            action="/api/ledger/upload" 
            list-type="picture-card"
            :on-success="(response, file) => handlePictureSuccess(response, file, 'after')"
            :before-upload="beforeUpload"
            name="file"
          >
            <el-button>点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="原因分析及整改措施" prop="analysisAndMeasures">
          <el-input v-model="ledgerForm.analysisAndMeasures" type="textarea" placeholder="请输入原因分析及整改措施" />
        </el-form-item>
      </div>
      <!-- 第十二行 -->
      <div class="form-row">
        <el-form-item label="整改完成时间" prop="rectificationFinishTime">
          <el-date-picker v-model="ledgerForm.rectificationFinishTime" type="date" placeholder="选择整改完成时间" />
        </el-form-item>
        <el-form-item label="考核人员" prop="assessmentPerson">
          <el-autocomplete
            v-model="ledgerForm.assessmentPerson"
            :fetch-suggestions="fetchUsernames"
            placeholder="请输入考核人员"
            @select="handleSelectUser"
          >
            <template v-slot="{ item }">
              <div>
                <span>{{ item.name }}</span> - <span style="color: gray;">{{ item.phone }}</span>
              </div>
            </template>
          </el-autocomplete>
        </el-form-item>
      </div>
      <!-- 提交按钮 -->
      <div class="button-row">
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button type="warning" @click="resetForm">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { addLedgerEntry } from '@/api/Ledger';
import { searchUsers } from '@/api/user'; // 确保路径正确
import { getToken } from '@/utils/auth'; // 引入获取 token 的方法
import { jwtDecode } from 'jwt-decode'; // 确保项目中安装并引入 jwt-decode 库

export default {
  data() {
    return {
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
        issueDescription: '',
        beforeRectificationPhotos: '', 
        afterRectificationPhotos: '', 
        teamLeader: '',
        inspector: '',
        analysisAndMeasures: '',
        rectificationFinishTime: '',
        assessmentPerson: '',
        currentUserPhone: ''
      },
      rules: {
        inspectionType: [{ required: true, message: '请输入巡查类型', trigger: 'blur' }],
        checkTime: [{ required: true, message: '请选择排查时间', trigger: 'change' }],
        rectificationDeadline: [{ required: true, message: '请选择限期整改时间', trigger: 'change' }],
        hazardSeverity: [{ required: true, message: '请选择隐患严重程度', trigger: 'change' }],
        issueCategory: [{ required: true, message: '请输入问题大类', trigger: 'blur' }],
        subCategory: [{ required: true, message: '请输入问题子类', trigger: 'blur' }],
        detailedCategory: [{ required: true, message: '请输入详细分类', trigger: 'blur' }],
        department: [{ required: true, message: '请输入责任科室', trigger: 'blur' }],
        hazardArea: [{ required: true, message: '请输入隐患区域', trigger: 'blur' }],
        personInCharge: [{ required: true, message: '请输入责任人', trigger: 'blur' }],
        subArea: [{ required: true, message: '请输入子区域', trigger: 'blur' }],
        detailedArea: [{ required: true, message: '请输入详细区域', trigger: 'blur' }],
        issueObject: [{ required: true, message: '请输入问题对象', trigger: 'blur' }],
        issueMode: [{ required: true, message: '请输入问题模式', trigger: 'blur' }],
        lValue: [{ required: true, message: '请输入L值', trigger: 'blur' }],
        eValue: [{ required: true, message: '请输入E值', trigger: 'blur' }],
        cValue: [{ required: true, message: '请输入C值', trigger: 'blur' }],
        dValue: [{ required: true, message: '请输入D值', trigger: 'blur' }],
        issueDescription: [{ required: true, message: '请输入问题描述', trigger: 'blur' }],
        analysisAndMeasures: [{ required: true, message: '请输入原因分析及整改措施', trigger: 'blur' }],
        rectificationFinishTime: [{ required: true, message: '请选择整改完成时间', trigger: 'change' }],
        assessmentPerson: [{ required: true, message: '请输入考核人员', trigger: 'blur' }],
      },
    };
  },
  created() {
    this.extractPhoneFromToken(); // 在组件创建时提取 phone
  },
  methods: {
    extractPhoneFromToken() {
      try {
        const token = getToken(); // 获取 token
        console.log('Token:', getToken());
        const decoded = jwtDecode(token); // 解码 token
        this.ledgerForm.currentUserPhone = decoded.sub; // 提取 phone 并赋值
      } catch (error) {
        console.error('Token 解码失败或 phone 不存在', error);
      }
    },
    // 调用后端接口搜索用户
    fetchUsernames(queryString, callback) {
      if (!queryString) {
        return callback([]);
      }
      searchUsers(queryString)
        .then(response => {
          const results = response.map(user => ({
            name: user.name,
            phone: user.phone,
            value: `${user.name} - ${user.phone}` // 用于显示的组合字符串
          }));
          callback(results);
        })
        .catch(error => {
          console.error('Error fetching users:', error);
          callback([]);
        });
    },

    handleSelectUser(item) {
      this.ledgerForm.assessmentPerson = item.phone; // 存储选择的用户名
    },

    handleSubmit() {
      this.$refs.ledgerForm.validate((valid) => {
        if (valid) {
          const payload = { ...this.ledgerForm };
          addLedgerEntry(payload)
            .then(() => {
              this.$message.success('提交成功！');
              this.resetForm();
            })
            .catch(() => {
              this.$message.error('提交失败，请重试！');
            });
        } else {
          this.$message.error('表单验证失败，请检查输入！');
        }
      });
    },
    handlePictureSuccess(response, file, type) {
      let url;

      // 判断响应数据的格式是否是字符串
      if (typeof response === "string") {
        // 解析字符串中包含的 URL
        const match = response.match(/url:([^\s]+)/); // 提取 "url:" 后的部分
        url = match ? match[1] : null;
      } else {
        // 假设是 JSON 格式
        url = response.url || response.data?.url;
      }

      if (url) {
        const photo = { id: Date.now(), url };

        if (type === "before") {
          this.ledgerForm.beforeRectificationPhotos = url;
        } else if (type === "after") {
          this.ledgerForm.afterRectificationPhotos = url;
        }

        this.$message.success("照片上传成功！");
      } else {
        console.error("上传失败，无法解析返回数据！响应数据:", response);
        this.$message.error("上传失败，返回数据格式不正确！");
      }
    },
    beforeUpload(file) {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        this.$message.error("只允许上传图片文件!");
      }
      return isImage; // 阻止文件上传
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
        issueDescription: '',
        isFirstDiscovery: false,
        teamLeader: '',
        deductionScore: '',
        inspector: '',
        analysisAndMeasures: '',
        rectificationFinishTime: '',
        assessmentPerson: '',
        currentUserPhone: ''
      };
    },
  },
};
</script>
<style scoped>
.ledger-form {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  font-size: 14px;
  padding: 20px;
  box-sizing: border-box;
}
.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.form-row .el-form-item {
  flex: 1;
  margin-right: 10px;
}
.form-row .el-form-item:last-child {
  margin-right: 0;
}
.button-row {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.button-row .el-button {
  margin: 0 10px;
}
.content {
  text-align: center;
  margin-bottom: 20px;
}
@media print {
  body {
    width: 210mm;
    height: 297mm;
    font-size: 12px;
    margin: 0;
    padding: 0;
  }
  .ledger-form {
    page-break-after: always;
  }
  .el-button {
    display: none;
  }
}
</style>