<template>
  <el-form v-model="form">
    <el-form-item label="用户名">
      <el-input v-model="form.username"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input type="password" v-model="form.password"></el-input>
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="form.email"></el-input>
    </el-form-item>
    <el-form-item label="手机号">
      <el-input v-model="form.iphone"></el-input>
    </el-form-item>
    <el-form-item label="微信">
      <el-input v-model="form.wechat"></el-input>
    </el-form-item>
    <el-form-item label="QQ">
      <el-input v-model="form.qq"></el-input>
    </el-form-item>
    <el-form-item label="地址">
      <el-input v-model="form.address"></el-input>
    </el-form-item>
  </el-form>

</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
const form = reactive({
  username: '',
  password: '',
  email: '',
  iphone: '',
  wechat: '',
  qq: '',
  address: '',
  code: ''
})
</script>

<style lang='scss' scoped>
</style>