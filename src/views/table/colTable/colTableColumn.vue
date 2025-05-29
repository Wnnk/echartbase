<!--  -->

<template>
  <el-table-column :prop="column.prop" :label="column.label" :width="column.width">
    <template  v-if="column.children && column.children.length">
      <col-table-column v-for="child in column.children" :column="child"> </col-table-column>
    </template>
  </el-table-column>

</template>

<script setup lang='ts'>
import type { ColumnType } from './type.ts'
const { column } = defineProps({
  column: {
    type: Object as () => ColumnType,
    required: true,

  }
})

</script>

<style lang='scss' scoped>
</style>