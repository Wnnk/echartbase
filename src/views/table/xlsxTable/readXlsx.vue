<template>
  <div>
    <el-upload ref="upload" :limit="1" :auto-upload="false" 
      :on-change="readXlsx" 
      :show-file-list="true"
    >
      <el-button size="default" type="primary">选择文件</el-button>
    </el-upload>
   
  
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import type { Ref } from 'vue'
import * as XLSX from 'xlsx'
/* 0: 未开始 1: 进行中 2: 已完成 */
const status = ref(0)
const inputRef = ref()
const tableData:Ref<any[]> = ref([])
const headers:Ref<string[]> = ref([])
const htmlContent = ref('');
interface UploadFile {
  raw:File,
  [key:string]:any
}
const readXlsx = async (file:UploadFile) => {
  const reader = new FileReader()
  const fileBolb =  new Blob([file.raw], {type: file.type})
  reader.readAsArrayBuffer(fileBolb)
  reader.onload = async (e) => {
    if(!e.target){
      console.log('no target')
      return
    }
    const data = e.target.result
    const workbook = XLSX.read(data, {type: 'binary',cellStyles: true})
    const firstSheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[firstSheetName]
    const cells = getSheetCells(sheet)

   
  }

}
/** 
 * description: 获取表格所有单元格内容
 * @param sheet 表格数据
 * @return string[][] 所有单元格内容
  */
const getSheetCells = (sheet:any) => {
  if(!sheet || !sheet['!ref']) return []
  const range = XLSX.utils.decode_range(sheet['!ref'])
  let  allCells: string[][] = []
  for(let row = range.s.r; row <= range.e.r; row++){
    let newRow: string[] = []
    for(let col = range.s.c; col <= range.e.c; col++){
      const cell = sheet[XLSX.utils.encode_cell({c: col, r: row})]
      console.log(cell)
      let cellContent = '';
      if(cell && cell.t) {
        cellContent = XLSX.utils.format_cell(cell)
      }
      newRow.push(cellContent)
    }
    allCells.push(newRow)
  }
  return allCells
}



</script>

<style lang="scss" scoped>
#readTable {
  width: 100%;
  border-collapse: collapse;
}



</style>
