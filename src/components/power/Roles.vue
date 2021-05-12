<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card
      ><el-button type="primary" @click="dialogVisible = true">
        添加角色
      </el-button>
      <el-table :data="rightsList" style="width: 100%" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {}
</script>
<style lang="less" scoped></style>
