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
      <el-button type="primary" @click="showCateDialogVisible">
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
      @close="addCateDialogClosed"
    >
      <el-form
        ref="addCateFormRef"
        :rules="addCateFormRules"
        :model="addCateFormData"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateFormData.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 级联选择器 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="casaderProps"
            @change="parentCateChanged"
            clearable
          ></el-cascader
        ></el-form-item>
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
        // 分类名
        cat_name: '',
        // 分类父ID
        cat_pid: 0,
        // 分类层级
        cat_level: 0
      },
      // 表单验证
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      // 父级分类列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      casaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: 'true'
      },
      // 被选中的父级id数组
      selectedKeys: []
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
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.parentCateList = res.data
    },
    // 选择项发生变化时触发
    parentCateChanged() {
      // 如果 this.selectedKeys 数组中的length 大于0 ，证明组那种的腹肌分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateFormData.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 为当前分类的等级赋值
        this.addCateFormData.cat_level = this.selectedKeys.length
        return false
      } else {
        // 父级分类的id
        this.addCateFormData.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateFormData.cat_level = 0
      }
      console.log(this.addCateFormData)
    },
    // 添加分类
    addCate() {
      console.log(this.addCateFormData)
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写分类名称')
        }
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateFormData
        )
        if (res.meta.status !== 201) {
          return this.welcome$message.error(this.$message.error(res.meta.msg))
        }
        this.$message.success(res.meta.msg)
        this.getCatesList()
        this.addCateDialogVisible = false
      })
    },
    // 监听关闭添加分类对话框,重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateFormData.cat_level = 0
      this.addCateFormData.cat_pid = 0
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
