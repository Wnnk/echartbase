<template>
  <el-table :data="tableData" border style="width: 100%" :span-method="mergeCell">
    <el-table-column label="ID" prop="id"></el-table-column>
    <el-table-column label="日期" prop="date"></el-table-column>
    <el-table-column label="姓名" prop="name"></el-table-column>
    <el-table-column label="省份" prop="province"></el-table-column>
    <el-table-column label="城市" prop="city"></el-table-column>
    <el-table-column label="区县" prop="area"></el-table-column>
    <el-table-column label="地址" prop="address"></el-table-column>
    <el-table-column label="邮编" prop="zip"></el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

const tableData: any = ref([
  {
    id: 1,
    date: '2022-01-01',
    name: '张三',
    province: '上海',
    city: '上海市',
    area: '浦东新区',
    address: '上海市浦东新区东方路100号',
    zip: '200000',
  },
  {
    id: 2,
    date: '2022-01-02',
    name: '李四',
    province: '北京',
    city: '北京市',
    area: '朝阳区',
    address: '北京市朝阳区北三环东路100号',
    zip: '210000',
  },
  {
    id: 3,
    date: '2022-01-03',
    name: '王五',
    province: '广东',
    city: '广州市',
    area: '天河区',
    address: '广州市天河区黄埔大道100号',
    zip: '210000',
  },
  {
    id: 4,
    date: '2022-01-04',
    name: '赵六',
    province: '江苏',
    city: '南京市',
    area: '雨花台区',
    address: '南京市雨花台区雨花路100号',
    zip: '210000',
  },
  {
    id: 5,
    date: '2022-01-05',
    name: '柳七',
    province: '江苏',
    city: '苏州市',
    area: '姑苏区',
    address: '苏州市姑苏区苏州街100号',
    zip: '215000',
  },
])
const spanMap = new Map()

const mergeCell = ({ row, column, rowIndex }: { row: any; column: any; rowIndex: number }) => {
  const colProp = column.property
  const spans = spanMap.get(colProp)
  if (spans && spans[rowIndex] !== undefined) {
    return {
      rowspan: spans[rowIndex],
      colspan: spans[rowIndex] > 0 ? 1 : 0,
    }
  }
  return { rowspan: 1, colspan: 1 }
}

const calculateSpan = (colums: string[]) => {
  colums.forEach((col) => {
    const spans = []
    let count = 1 /* 合并数 */
    let startPos = 0 /* 开始位置 */
    for (let i = 1; i < colums.length; i++) {
      /* 判断是否相同 */
      if (i < tableData.value.length && tableData.value[i][col] === tableData.value[i - 1][col]) {
        count++
      } else {
        spans[startPos] = count
        /* 合并数置零 */
        for (let j = startPos + 1; j < startPos + count; j++) {
          spans[j] = 0
        }
        /* 更新开始位置 */
        startPos = i
        count = 1
      }
    }
    spanMap.set(col, spans)
    console.log(spanMap)
  })
}
onMounted(() => {
  calculateSpan(['date', 'name', 'province', 'city', 'area', 'address', 'zip'])
})
</script>

<style lang="scss" scoped></style>
