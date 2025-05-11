<template>
  <el-form :model="form" ref="formRef" :rules="rules">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="form.password"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email"></el-input>
    </el-form-item>
    <el-form-item label="手机号" prop="iphone">
      <el-input v-model="form.iphone"></el-input>
    </el-form-item>
    <el-form-item label="微信" prop="wechat">
      <el-input v-model="form.wechat"></el-input>
    </el-form-item>
    <el-form-item label="QQ" prop="qq">
      <el-input v-model="form.qq"></el-input>
    </el-form-item>
    <el-form-item label="地址" prop="address">
      <el-input v-model="form.address"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">保存</el-button>
      <el-button type="primary">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
const form = reactive({
  username: '',
  password: '',
  email: '',
  iphone: '',
  wechat: '',
  qq: '',
  address: '',
  code: '',
})
const formRef = ref()
const visible = ref(false)
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}
const submitForm = async () => {
  console.log(form)
  const res = await formRef.value.validate()
  console.log(res)
}
</script>

<style lang="scss" scoped></style>
