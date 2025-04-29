<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label>姓名:</label>
      <input v-model="formData.name" />
    </div>
    <div>
      <label>邮箱:</label>
      <input v-model="formData.email" />
    </div>
    <button type="submit">提交</button>
    <button type="button" @click="clearCache">清除缓存</button>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import useFormCache from '@/hooks/useFormCache';

// 组件定义自己的表单数据

// 使用缓存hook
const { loadFromCache, clearCache, setupAutoSave } = useFormCache('userProfileForm');

interface UserFormData {
  name: string;
  email: string;
  age?: number; // 可选字段
}
const formData = ref<UserFormData>({
  name: '',
  email: '',
});
// 初始化时加载缓存
onMounted(() => {
  const cachedData = loadFromCache();
  if (cachedData) {
    formData.value = cachedData;
  }
  
  // 设置自动保存
  setupAutoSave(formData.value);
});

const handleSubmit = () => {
  console.log('提交表单:', formData.value);
  clearCache();
};
</script>