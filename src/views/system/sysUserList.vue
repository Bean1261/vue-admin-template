<template>
  <div>
    <el-card>
      <div class="header">
        <el-button type="primary" @click="openDialog('add')">新增用户</el-button>
        <el-input v-model="searchText" placeholder="请输入用户名或编号" clearable />
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">
          查询
        </el-button>
      </div>
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="phone" label="编号" />
        <el-table-column prop="permissions" label="权限" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openDialog('edit', scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteUser(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogType === 'add' ? '新增用户' : '编辑用户'" :visible.sync="dialogVisible">
      <el-form :model="dialogForm" :rules="dialogRules" ref="dialogForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="dialogForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="编号" prop="phone">
          <el-input v-model="dialogForm.phone" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="权限" prop="permissions">
          <el-select v-model="dialogForm.permissions" placeholder="请选择权限">
            <el-option label="admin" value="admin" />
            <el-option label="user" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="dialogForm.password"
            placeholder="请输入密码"
            :type="passwordVisible ? 'text' : 'password'"
          >
            <template #append>
              <el-button type="text" @click="togglePasswordVisible">
                <i :class="passwordVisible ? 'el-icon-view' : 'el-icon-view-off'" />
              </el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      searchText: "", // 搜索框文本
      userList: [], // 用户列表
      dialogVisible: false, // 控制弹窗显示
      dialogType: "add", // 当前弹窗类型：add 或 edit
      passwordVisible: false, // 控制密码可见性
      dialogForm: {
        id: null,
        username: "",
        phone: "",
        permissions: "",
        password: "",
      },
      dialogRules: {
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        phone: [{ required: true, message: "请输入编号", trigger: "blur" }],
        permissions: [{ required: true, message: "请选择权限", trigger: "change" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 加载用户数据
    loadData() {
      axios
        .get("/user")
        .then((res) => {
          this.userList = res.data || [];
        })
        .catch((err) => {
          console.error("加载用户列表失败", err);
        });
    },
    // 点击查询按钮后进行搜索
    handleSearch() {
      const searchParams = {};
      if (this.searchText) {
        // 判断输入的内容是用户名还是编号
        const isPhone = /^[\d]{7}$/.test(this.searchText); // 简单的手机号正则验证
        if (isPhone) {
          searchParams.phone = this.searchText;
        } else {
          searchParams.username = this.searchText;
        }

        // 发送请求到后端查询
        axios
          .get("/user/query", { params: searchParams })
          .then((res) => {
            if (res.data) {
              this.userList = [res.data]; // 返回的单个用户，更新为一个数组
            } else {
              this.userList = []; // 如果没有找到用户，清空列表
              this.$message.warning("未找到相关用户");
            }
          })
          .catch((err) => {
            console.error("查询失败", err);
            this.$message.error("查询失败");
          });
      } else {
        // 如果搜索框为空，重新加载所有用户
        this.loadData();
      }
    },
    // 打开新增/编辑弹窗
    openDialog(type, user = null) {
      this.dialogType = type;
      this.dialogForm = type === "edit" ? { ...user, password: "" } : { id: null, username: "", phone: "", permissions: "", password: "" };
      this.dialogVisible = true;
    },
    // 保存新增或编辑用户
    dialogSave() {
      this.$refs.dialogForm.validate((valid) => {
        if (!valid) return;

        const user = this.dialogForm;
        if (this.dialogType === "add") {
          // 新增用户
          axios
            .post("/user", user)
            .then(() => {
              this.dialogVisible = false;
              this.loadData();
              this.$message.success("用户新增成功");
            })
            .catch((err) => {
              console.error("新增失败", err);
              this.$message.error("用户新增失败");
            });
        } else {
          // 编辑用户
          axios
            .put(`/user/${user.id}`, user)
            .then(() => {
              this.dialogVisible = false;
              this.loadData();
              this.$message.success("用户编辑成功");
            })
            .catch((err) => {
              console.error("编辑失败", err);
              this.$message.error("用户编辑失败");
            });
        }
      });
    },
    // 删除用户
    deleteUser(id) {
      this.$confirm("确认删除该用户？", "提示", {
        type: "warning",
      })
        .then(() => {
          axios
            .delete(`/user/${id}`)
            .then(() => {
              this.loadData();
              this.$message.success("用户删除成功");
            })
            .catch((err) => {
              console.error("删除失败", err);
              this.$message.error("用户删除失败");
            });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 切换密码可见性
    togglePasswordVisible() {
      this.passwordVisible = !this.passwordVisible;
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
