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
          <el-button
            type="primary"
            :disabled="isBtnDisable"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" style="width: 100%" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  class="elTag"
                  closable
                  v-for="(val, index) in scope.row.attr_vals"
                  :key="index"
                  >{{ val }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isBtnDisable"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态表格 -->
          <el-table :data="onlyTableData" style="width: 100%" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                {{ scope.row }}
                <!-- <el-tag v-for="val in scope.row" :key="val.attr_id"
                  >标签一</el-tag
                > -->
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加动态参数对话框 -->
    <el-dialog
      :title="'添加' + this.titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        label-width="80px"
        :rules="addFormRules"
      >
        <el-form-item :label="this.titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      :title="'修改' + this.titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        label-width="80px"
        :rules="editFormRules"
      >
        <el-form-item :label="this.titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </template>
    </el-dialog>
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
      onlyTableData: [],
      //  对话框状态
      addDialogVisible: false,
      // 对话框表单
      addForm: {
        attr_name: ''
      },
      // 对话框表单验证
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      },
      //   编辑对话框状态
      editDialogVisible: false,
      //   编辑表单
      editForm: {
        attr_name: ''
      },
      //   编辑表单验证
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: '请填写参数',
            trigger: 'blur'
          }
        ]
      }
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
      this.getParamsDate()
    },
    // 选中标签页时触发
    handleTabClick() {
      if (this.cateId === null) {
        return false
      }
      this.getParamsDate()
      console.log(this.activeName)
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
      console.log(res.data)
      res.data.forEach(item => {
        console.log(item)
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTableData = res.data
        console.log(this.manyTableData)
      } else {
        this.onlyTableData = res.data
      }
    },
    // 关闭对话框触发，清除内容
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 提交添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.getParamsDate()
        console.log(res.data)
        this.addDialogVisible = false
      })
    },
    // 关闭编辑对话框做清除处理
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击打开编辑对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 提交参数修改
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const {
          data: res
        } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.getParamsDate()
        this.$message.success(res.meta.msg)
        this.editDialogVisible = false
      })
    },
    // 删除事件
    async removeParams(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult === 'cancel') {
        return this.$message.info('取消删除')
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.getParamsDate()
      this.$message.success(res.meta.msg)
    },
    // 文本失去焦点，或者摁下 enter
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
    },
    // 点击变成输入框
    showInput(row) {
      row.inputVisible = true
      //   $nextTick 页面上元素被重新渲染后才会制定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
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
    },
    // 根据tab显示对话框标题
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
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
.elTag {
  margin-right: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
