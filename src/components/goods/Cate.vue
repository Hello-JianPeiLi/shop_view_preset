<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-button type="primary" @click="addCateDialogVisible = true">
        添加分类
      </el-button>
      <!-- 主题表格 -->
      <tree-table
        :data="catesList"
        :columns="columns"
        :selection-type="false"
        show-index
        index-text="#"
        :expand-type="false"
        border
        style="margin-top:20px"
      >
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else-if="scope.row.cat_level === 2"
            >三级</el-tag
          >
        </template>
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 页码  -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
    >
      <el-form ref="form" :model="addCateFormData" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="addCateFormData.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 分类列表
      catesList: [],
      // 查询对象
      queryInfo: {
        type: 3,
        // 页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 5
      },
      //  总条数
      total: 0,
      // tree-table的列
      columns: [
        {
          label: '商品分类',
          prop: 'cat_name',
          width: '400px'
        },
        {
          // 对应template 插槽
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '排序',
          type: 'template',
          template: 'opt'
        }
      ],
      //   添加分类对话框
      addCateDialogVisible: false,
      //   添加分类表单对象
      addCateFormData: {
        cat_name: ''
      }
    }
  },
  created() {
    this.getCatesList()
  },
  methods: {
    // 获取商品分类列表
    async getCatesList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.catesList = res.data.result
      this.total = res.data.total
      console.log(res)
    },
    // 监听每页条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCatesList()
    },
    // 监听页码变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCatesList()
    },
    // 展示添加分类对话框
    showCateDialogVisible() {
      this.addCateDialogVisible = true
    },
    // 添加分类
    addCate() {
      this.addCateDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped></style>
