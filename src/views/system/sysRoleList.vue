<template>
  <div class="role-management">
    <!-- 搜索栏 -->
    <el-row :gutter="20" class="search-row">
      <el-col :span="8">
        <el-input
          v-model="searchQuery"
          placeholder="请输入角色名称或描述"
          clearable
          @input="handleSearch"
        ></el-input>
      </el-col>
      <el-col :span="16" class="text-right">
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="openAddDialog">新增角色</el-button>
      </el-col>
    </el-row>

    <!-- 角色列表 -->
    <el-table :data="filteredRoles" stripe border style="width: 100%">
      <el-table-column label="角色名称" prop="roleName" min-width="180"></el-table-column>
      <el-table-column label="角色描述" prop="description" min-width="300"></el-table-column>
      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button size="small" @click="openEditDialog(scope.row)" type="primary">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteRole(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑角色的对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="currentRole" ref="roleForm" :rules="roleRules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="currentRole.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="currentRole.description" type="textarea" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRole">保存</el-button>
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
      filteredRoles: [
        { id: 1, roleName: '管理员', description: '拥有所有权限，能管理系统内所有内容。' },
        { id: 2, roleName: '普通用户', description: '只能查看信息，不能修改或删除。' },
        { id: 3, roleName: '编辑', description: '可以编辑信息，但不能删除。' },
        { id: 4, roleName: '访客', description: '只能查看有限的内容。' }
      ],
      currentRole: { id: null, roleName: '', description: '' },
      dialogVisible: false,
      dialogTitle: '新增角色',
      roleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      searchQuery: '', // 搜索查询条件
    };
  },
  computed: {
    // 计算属性，用于过滤角色列表
    filteredRoles() {
      if (!this.searchQuery) {
        return this.roles; // 如果没有搜索条件，返回所有角色
      }
      return this.roles.filter(role => {
        return role.roleName.includes(this.searchQuery) || role.description.includes(this.searchQuery);
      });
    }
  },
  methods: {
    // 处理搜索，点击搜索按钮或者输入时触发
    handleSearch() {
      // 计算属性已经处理了搜索逻辑
    },

    // 打开新增角色对话框
    openAddDialog() {
      this.dialogTitle = '新增角色';
      this.currentRole = { id: null, roleName: '', description: '' }; // 清空表单
      this.dialogVisible = true;
    },

    // 打开编辑角色对话框
    openEditDialog(role) {
      this.dialogTitle = '编辑角色';
      this.currentRole = { ...role }; // 填充表单数据
      this.dialogVisible = true;
    },

    // 保存角色（新增或编辑）
    saveRole() {
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          if (this.currentRole.id) {
            // 编辑角色
            axios.put(`/api/roles/${this.currentRole.id}`, this.currentRole)
              .then(() => {
                this.$message.success('角色编辑成功');
                this.fetchRoles(); // 重新获取角色列表
                this.dialogVisible = false;
              })
              .catch(() => {
                this.$message.error('角色编辑失败');
              });
          } else {
            // 新增角色
            axios.post('/api/roles', this.currentRole)
              .then(() => {
                this.$message.success('角色新增成功');
                this.fetchRoles(); // 重新获取角色列表
                this.dialogVisible = false;
              })
              .catch(() => {
                this.$message.error('角色新增失败');
              });
          }
        }
      });
    },

    // 删除角色
    deleteRole(roleId) {
      this.$confirm('确定删除该角色吗？', '提示', {
        type: 'warning'
      }).then(() => {
        axios.delete(`/api/roles/${roleId}`)
          .then(() => {
            this.$message.success('角色删除成功');
            this.fetchRoles(); // 重新获取角色列表
          })
          .catch(() => {
            this.$message.error('角色删除失败');
          });
      });
    },

    // 获取角色列表（假设从API获取数据，当前为模拟数据）
    fetchRoles() {
      // 这里模拟获取数据
      // axios.get('/api/roles')
      //   .then(response => {
      //     this.roles = response.data;
      //   })
      //   .catch(error => {
      //     this.$message.error('获取角色列表失败');
      //   });
    }
  },
  created() {
    this.fetchRoles(); // 页面加载时获取角色列表
  }
};
</script>

<style scoped>
.role-management {
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
