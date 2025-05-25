<template>
  <div>
    <input
      placeholder="选择文件"
      type="file"
      @change="readXlsx"
      accept=".xlsx, .xls"
      ref="inputRef"
    ></input>
    <el-table v-if="status !== 0" :data="tableData"></el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import * as XLSX from 'xlsx'
/* 0: 未开始 1: 进行中 2: 已完成 */
const status = ref(0)
const inputRef = ref()
const tableData = ref([])

const readXlsx = (e: Event) => {
  const target = e.target as HTMLInputElement
  // const file = target.files?.[0]
  console.log(e)
}
</script>

<style lang="scss" scoped></style>
