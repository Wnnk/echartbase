<!--  -->

<template>
  <el-table :data="data" row-key="id" border>
    <el-table-column v-for="item in data" :key="item.id" :prop="item.prop" :label="item.name">
    </el-table-column>
  </el-table>
</template>

<script setup lang="js">
import { ref } from 'vue'

const { data } = defineProps({
  data: {
    type: Array,
    required: true,
  },
})
console.log(data)
</script>

<style lang="scss" scoped></style>
