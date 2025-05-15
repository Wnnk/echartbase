<template>
  <el-form v-loading="status === 1" v-if="status!== 3">
    <span>选择商品</span>
    <div>
      <div>
        <span>请求来的数据:</span>
        <div v-for="item in data" :key="item">
          {{item}}
        </div>
      </div>
      <span>
        <el-button @click="handleCancel">取消</el-button>
        <el-button @click="handleOk">确定</el-button>
      </span>
    </div>
  </el-form>
  <div v-else-if="status === 3">
    <el-button @click="requestData">重试</el-button>
  </div>


</template>

<script setup lang='ts'>
import {  defineEmits, ref, onMounted } from 'vue';
const emit = defineEmits(['cancel','ok']);
const status = ref(0);
const data = ref<any[]>([])
const handleOk = () => {
  emit('ok',[1,2,3]);
};
const handleCancel = () => {
  emit('cancel',[4,5,6]);
}
const getData = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.5 ? resolve([1,2,3]) : reject(new Error('error'))
    }, 2000)
  })
}

const requestData = async () => {
  try {
    status.value = 1
    data.value = await getData() as any[]
    status.value = 2
  } catch (error) {
    status.value = 3
  }
}

onMounted(async () => {
 requestData()
  
})
</script>

<style lang='scss' scoped>
</style>