<template>
    <div class="login_container">
        <div class="login_box">
            <!-- logo -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 表单区域 -->
            <el-form label-width="80px">
                <el-form-item label="活动名称">
                    <el-input></el-input>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
}
</script>

<style lang='less' scoped>
.login_container{
    height: 100%;
    background-color: #2b5b6b;
}
.login_box{
    height: 300px;
    width: 430px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
.avatar_box{
    width: 130px;
    height: 130px;
    border: 1px solid #ccc;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #fff;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
    }
}
</style>
