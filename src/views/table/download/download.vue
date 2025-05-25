<!-- 
  @description: 基础下载功能xlsx

-->

<template>
  <div>
    <el-table ref="tableRef" :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="编号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="sex" label="性别"></el-table-column>
      <el-table-column prop="city" label="城市"></el-table-column>
      <el-table-column prop="points" label="积分"></el-table-column>
    </el-table>
    <el-button @click="download">下载</el-button>
  </div>


</template>

<script setup lang='ts'>
import { ref } from 'vue'
import { getTableData } from '../tableData';
import * as XLSX from 'xlsx'

const tableData = ref([])
const tableRef = ref()
const status = ref(0);
const api  = async () => {
  try {
    status.value = 1
    const res = await getTableData() as any
    if (res.code === 2000) {
      tableData.value = res.data
    }
    status.value = 2
  } catch (error) {
    status.value = 3
  }
}
api()
const download = () => {
  const book = XLSX.utils.book_new()
  const sheet = XLSX.utils.table_to_sheet(tableRef.value.$el);
  XLSX.utils.book_append_sheet(book, sheet, 'Sheet1');
  XLSX.writeFile(book, 'table.xlsx');
}
</script>

<style lang='scss' scoped>
</style>