<!-- select闪烁问题:v-model绑定id，数据源长时间通信，挂了 -->
<template>
  <div>
    {{ form }}
    <el-select v-model="user" value-key="id">
      <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item"></el-option>
    </el-select>
  </div>

</template>

<script setup lang='js'>
import { ref, reactive, onMounted, computed } from 'vue';
const options = ref([]);
let status =ref(0);
const form = reactive({
  user:{
    id: 1,
    name: '张三'
  }
})

const api =  () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = Array(10).fill(0).map((_,index) => ({
        id: index,
        name: `name${Math.random()}`,
        age: `age${Math.random()}`
      }))
      resolve(data)
    }, 3000)
  })
}
const loadHandler = async () => {
  try {
    status.value = 1
    const data = await api()
    options.value = data
    status.value = 2
  } catch (error) {
    status.value = 3
  }
}
onMounted(() => {
  loadHandler()
})

/* 方案一: v-model不直接绑定form.user， 而是通过{label:xx, id:xx}的computed变量 */
const user = computed({
  get() {
    return {
      label: form.user.name,
      id: form.user.id
    }
  },
  set(item) {
    form.user.id = item.id
    form.user.name = item.name
  }
})



</script>

<style lang='scss' scoped>
</style>