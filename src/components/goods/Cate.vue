<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="dialogVisible = true">
        添加分类
      </el-button>
      <tree-table
        :data="catesList"
        :columns="columns"
        :selection-type="false"
        show-index
        index-text="#"
        :expand-type="false"
        border
      >
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i> </template
      ></tree-table>
    </el-card>
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
        pagenum: 1,
        pagesize: 5
      },
      // tree-table的列
      columns: [
        {
          label: '商品分类',
          prop: 'cat_name',
          width: '400px'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        }
      ]
    }
  },
  created() {
    this.getCatesList()
  },
  methods: {
    // 获取商品分类列表
    async getCatesList() {
      const { data: res } = await this.$http.get('categories', this.queryInfo)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meat.msg)
      }
      console.log(res.data)
      this.catesList = res.data
    }
  }
}
</script>

<style lang="less" scoped></style>
