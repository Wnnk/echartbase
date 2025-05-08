<template>
  <div>
    <div>{{ form }}</div>
    <div>通信状态: {{ status }}</div>
    <el-select v-model="form.id" :loading="status === 1">
      <el-option v-for="item in optionProxy" :key="item.id" :label="item.name" :value="item.id"></el-option>
      <template #empty>
        <div v-if="status === 1">
          Loaing...
        </div>
        <div v-else-if="status === 3">
          <el-button @click="loadHandler">重试</el-button>
        </div>
        <div v-else>
          暂无数据
        </div>
      </template>
    </el-select>
  </div>

</template>

<script setup lang='ts'>
import { ref,computed, reactive, onMounted } from 'vue'

const status = ref(0);
const options = ref<any[]>([
  {
    id:-1,
    name: '之前的参数',
    age: `age${Math.random()}`
  }
]);
const form = reactive({
  id: 1
})
const optionProxy = computed(() => {
  if(status.value === 0 || status.value === 2) {
    return options.value
  }
  return []
})
const api = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = Array(10).fill(0).map((_,index) => ({
        id: index,
        name:`name${Math.random()}`,
        age:`age${Math.random()}`
      }))
      Math.random() > 0.5? resolve(data) : reject(new Error('error'))
    }, 1000)
  })
}

const loadHandler = async () => {
  try {
    status.value = 1;
    const data = await api() as any[];
    options.value = data;
    status.value = 2;
  } catch (error) {
    status.value = 3;
  } 
}

onMounted(() => {
  loadHandler();
})
</script>

<style lang='scss' scoped>
</style>