<template>
  <el-table
    :data="data"
    ref="tableRef"
  >
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="id" label="ID"></el-table-column>
  </el-table>
</template>

<script setup>
import { ref, nextTick, onMounted, getCurrentInstance } from 'vue'
import { getTableData } from '../tableData'
import { ElLoading } from 'element-plus'

const status = ref(0)
const data = ref([])
const tableRef = ref(null)
const loadTarget = ref(null)

const api = async () => {
  try {
    status.value = 1
    load()
    const res = await getTableData()
    data.value = res.data
  } catch (error) {
    status.value = 3
    console.error(error)
  } finally {
    console.log('finally',loadInstance)
    unload()
  }
}
const {  appContext } = getCurrentInstance();
let loadInstance = null;
const load = () => {
  loadInstance = ElLoading.service({
    target: loadTarget.value,
  },appContext)
  console.log('load',loadInstance)
}
const unload = () => {
  loadInstance.close()
}



onMounted(() => {
  nextTick(() => {
    loadTarget.value = tableRef.value.$el.querySelector('.el-table__body-wrapper');
    if (loadTarget.value) {
      api()
    }
  })
})
</script>