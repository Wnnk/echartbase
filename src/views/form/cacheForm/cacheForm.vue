<template>
  <el-form>
    <el-form-item label="姓名">
      <el-input v-model="formData.name">姓名</el-input>
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="formData.email">邮箱</el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="saveNow">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import useFormCache from '@/hooks/useFormCache'
import useCache from '@/hooks/useCache'
// 组件定义自己的表单数据

// 使用缓存hook
// const { loadFromCache, clearCache, setupAutoSave } = useFormCache('userProfileForm')
const { loadFromCache, setupAutoSave, saveNow } = useCache('userProfileForm', {
  cachelocation: 'indexedDB',
})
interface UserFormData {
  name: string
  email: string
  age?: number // 可选字段
}
const formData = ref<UserFormData>({
  name: '',
  email: '',
})
// 初始化时加载缓存
onMounted(async () => {
  const cachedData = await loadFromCache()
  console.log('加载缓存:', cachedData)
  if (cachedData) {
    formData.value = cachedData
  }

  // 设置自动保存
  setupAutoSave(formData.value)
})

const handleSubmit = () => {
  console.log('提交表单:', formData.value)
  // clearCache()
}
const clearCache = () => {}
</script>
