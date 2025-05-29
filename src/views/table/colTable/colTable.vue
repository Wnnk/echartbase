<!-- 
  @description: table 动态列
    1.根据json可多级表头嵌套
-->

<template>
  <div>
    <el-table :data="data" v-bind="$attrs">
      <col-table-column v-for="(column, index) in columns"  
       :column="column"
      >
      </col-table-column>
    </el-table>
  </div>


</template>

<script setup lang='ts'>
import { ref } from 'vue'
import colTableColumn from './colTableColumn.vue';
import type { ColumnType } from './type.ts'
const { columns,data } = defineProps({
  columns: {
    type: Array as () => ColumnType[],
   required: true
  },
  data: {
    type: Array as () => any[],
    required: true
  }
}) 
console.log(data)
</script>

<style lang='scss' scoped>
</style>