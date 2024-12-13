<template>
  <el-main>
    <!-- 搜索栏 -->
    <el-form
      ref="searchRef"
      :model="listParm"
      label-width="80px"
      :inline="true"
      size="small"
    >
      <!-- 姓名输入框 -->
      <el-form-item>
        <el-input
          v-model="listParm.nickName"
          placeholder="请输入姓名"
        />
      </el-form-item>

      <!-- 电话输入框 -->
      <el-form-item>
        <el-input
          v-model="listParm.phone"
          placeholder="请输入电话"
        />
      </el-form-item>

      <!-- 按钮组 -->
      <el-form-item>
        <el-button
          icon="el-icon-search"
          @click="searchBtn"
        >搜索</el-button>
        <el-button
          style="color: #ff7670"
          icon="el-icon-close"
          @click="resetBtn"
        >重置</el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addBtn"
        >新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableData" border stripe>
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="date" label="日期" />
      <el-table-column label="操作" align="center" width="180">
        <template #default="{ scope }">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="editBtn(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="deleteBtn(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page.sync="listParm.currentPage"
      :page-sizes="[10, 20, 40, 80, 100]"
      :page-size="listParm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listParm.total"
      background
      @size-change="sizeChange"
      @current-change="currentChange"
    />
  </el-main>
</template>

<script>
export default {
  data() {
    return {
      // 表格高度
      tableHeight: 0,
      // 列表查询的参数
      listParm: {
        phone: '',
        nickName: '',
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 表格数据
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220
    })
  },
  methods: {
    // 重置按钮
    resetBtn() {
      this.listParm.nickName = ''
      this.listParm.phone = ''
      this.listParm.currentPage = 1
      this.listParm.pageSize = 10
    },

    // 搜索按钮
    searchBtn() {
      // Perform search logic (e.g., API call)
      console.log('Searching for:', this.listParm)
    },

    // 新增按钮
    addBtn() {
      // Navigate to add page or trigger add modal
      console.log('Add new item')
    },

    // 编辑按钮
    editBtn(row) {
      // Open edit modal or navigate to edit page
      console.log('Editing row:', row)
    },

    // 删除按钮
    deleteBtn(row) {
      // Confirm and delete the row
      console.log('Deleting row:', row)
    },

    // 页容量变化触发
    sizeChange(val) {
      this.listParm.pageSize = val
      console.log('Page size changed to:', val)
    },

    // 页数变化触发
    currentChange(val) {
      this.listParm.currentPage = val
      console.log('Current page changed to:', val)
    }
  }
}
</script>

<style lang="scss" scoped>
/* Add any specific styling needed here */
</style>
