<template>
<div>
 <el-form>
  <el-form-item label="Name">
    <el-input v-model="name"></el-input>
  </el-form-item>
  <el-form-item label="Age">
    <el-input v-model="age"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button @click="handleSubmit">提交</el-button>
  </el-form-item>
 </el-form>
</div>

</template>

<script setup lang='ts'>
import { ref } from 'vue'
const name = ref('')
const age = ref('')

const handleSubmit = () => {
  console.log(name.value, age.value)
}

</script>

<style lang='scss' scoped>
</style>