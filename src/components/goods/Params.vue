<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row>
        <el-col
          ><span>选择商品分类：</span>
          <!-- 选择商品分类的级联 -->
          <!-- option 级联数据 -->
          <!-- props 级联配置对象 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="cascaderChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisable"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" style="width: 100%" border>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                {{ scope.row }}
                <el-button type="primary" size="mini" icon="el-icon-edit"
                  >修改</el-button
                >
                <el-button type="danger" size="mini" icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisable"
            >添加属性</el-button
          >
          <!-- 静态表格 -->
          <el-table :data="onlyTableData" style="width: 100%" border>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                {{ scope.row }}
                <el-button type="primary" size="mini" icon="el-icon-edit"
                  >修改</el-button
                >
                <el-button type="danger" size="mini" icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 父级分类列表
      catelist: [],
      //   已选择的父级分类id
      selectedCateKeys: [],
      //   指定级联选择器的配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      //   tabs 默认选中
      activeName: 'many',
      //   many动态参数
      manyTableData: [],
      //   only 静态属性
      onlyTableData: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //   获取分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.catelist = res.data
    },
    // 级联选择框改变时触发
    cascaderChange() {
      if (this.selectedCateKeys.length === 0) {
        return false
      }
      this.getParamsDate(this.activeName)
    },
    // 选中标签页时触发
    handleTabClick() {
      if (this.cateId === null) {
        return false
      }
      this.getParamsDate()
      console.log(this.manyTableData)
      console.log(this.onlyTableData)
    },
    // 获取参数列表
    async getParamsDate() {
      // only:静态属性
      // many:动态参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    }
  },
  computed: {
    // 按钮禁用控制
    isBtnDisable() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 获取级联选择框三级id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        console.log('三级id', this.selectedCateKeys[2])
        return this.selectedCateKeys[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  margin-top: 20px;
}
.el-tabs {
  margin-top: 10px;
}
</style>
