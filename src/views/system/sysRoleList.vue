<template>
  <div class="role-management">
    <!-- 搜索栏 -->
    <el-row :gutter="20" class="search-row">
      <el-col :span="8">
        <el-input
          v-model="searchQuery"
          placeholder="请输入权限关键词"
          clearable
          @input="debouncedSearch"
        ></el-input>
      </el-col>
      <el-col :span="16" class="text-right">
        <el-button type="primary" icon="el-icon-search" @click="fetchRoles">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="openAddDialog">新增权限</el-button>
      </el-col>
    </el-row>

    <!-- 权限列表 -->
    <el-table :data="filteredRoles" stripe border style="width: 100%">
      <el-table-column label="权限" prop="permissions" min-width="300"></el-table-column>
      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button size="small" @click="openEditDialog(scope.row)" type="primary">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteRole(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-show="roles.length > 0"
      :current-page="pagination.page"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      @current-change="handlePageChange"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>

    <!-- 添加/编辑权限的对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="currentRole" ref="roleForm" :rules="roleRules" label-width="100px">
        <el-form-item label="权限" prop="permissions">
          <el-input v-model="currentRole.permissions" placeholder="请输入权限"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRole">保存</el-button>
      </div>
    </el-dialog>

    <!-- 加载状态 -->
    <el-loading v-if="loading" fullscreen lock text="加载中..." background="rgba(0, 0, 0, 0.7)"></el-loading>
  </div>
</template>

<script>
import axios from "axios";
import debounce from "lodash/debounce";

export default {
  data() {
    return {
      roles: [], // 原始角色数据
      currentRole: { id: null, permissions: "" },
      dialogVisible: false,
      dialogTitle: "新增权限",
      roleRules: {
        permissions: [{ required: true, message: "请输入权限", trigger: "blur" }]
      },
      searchQuery: "", // 搜索关键词
      loading: false, // 加载状态
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  computed: {
    // 计算属性：根据分页和搜索条件过滤角色数据
    filteredRoles() {
      const start = (this.pagination.page - 1) * this.pagination.pageSize;
      const end = this.pagination.page * this.pagination.pageSize;
      const filtered = this.roles.filter((role) =>
        role.permissions.includes(this.searchQuery)
      );
      this.pagination.total = filtered.length;
      return filtered.slice(start, end);
    }
  },
  methods: {
    // 防抖搜索
    debouncedSearch: debounce(function () {
      this.pagination.page = 1;
      this.fetchRoles();
    }, 300),

    // 获取权限列表
    async fetchRoles() {
      this.loading = true;
      try {
        const response = await axios.get("/api/roles");
        this.roles = response.data;
      } catch (error) {
        this.$message.error("获取权限列表失败：" + error.message);
      } finally {
        this.loading = false;
      }
    },

    // 打开新增权限对话框
    openAddDialog() {
      this.dialogTitle = "新增权限";
      this.currentRole = { id: null, permissions: "" };
      this.dialogVisible = true;
    },

    // 打开编辑权限对话框
    openEditDialog(role) {
      this.dialogTitle = "编辑权限";
      this.currentRole = { ...role };
      this.dialogVisible = true;
    },

    // 保存权限（新增或编辑）
    async saveRole() {
      this.$refs.roleForm.validate(async (valid) => {
        if (valid) {
          try {
            if (this.currentRole.id) {
              await axios.put(`/api/roles/${this.currentRole.id}`, this.currentRole);
              this.$message.success("权限编辑成功");
            } else {
              await axios.post("/api/roles", this.currentRole);
              this.$message.success("权限新增成功");
            }
            this.fetchRoles();
            this.dialogVisible = false;
          } catch (error) {
            this.$message.error("保存权限失败：" + error.message);
          }
        }
      });
    },

    // 删除权限
    async deleteRole(roleId) {
      try {
        await this.$confirm("确定删除该权限吗？", "提示", { type: "warning" });
        await axios.delete(`/api/roles/${roleId}`);
        this.$message.success("权限删除成功");
        this.fetchRoles();
      } catch (error) {
        this.$message.error("删除权限失败：" + (error.response?.data?.message || error.message));
      }
    },

    // 分页变化处理
    handlePageChange(page) {
      this.pagination.page = page;
    }
  },
  created() {
    this.fetchRoles(); // 页面加载时获取权限列表
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
