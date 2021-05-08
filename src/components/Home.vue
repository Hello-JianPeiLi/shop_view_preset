<template>
    <div>登录成功
        <el-button type="danger" plain @click="logout">退出</el-button>
    </div>
</template>

<script>
export default {
  methods: {
    logout () {
      window.sessionStorage.clear();
      this.$message.error('退出成功');
      this.$router.push('/login');
    }
  }
}
</script>

<style lang="less" scoped>

</style>
