<template>
  <div>
    <h1>使用Table组件界面</h1>
    <el-button @click="handleDiffTable">Diff Table</el-button>
    <diff-table v-if="visiableDiff" :origin-data="table1" :new-data="table2" />
    <diff-test :origin-data="table1" :new-data="table2" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import diffTable from '@/components/diffTable/diffTable.vue'
import diffTest from '@/components/diffTable/diffTest.vue'
const table1 = ref([
  {
    id: 10,
    date: '2022-01-01',
    name: 'Tom',
    address: '北京市海淀区西二旗',
    user: {
      name: '张三',
      id: 1,
      age: 20,
    },
  },
  {
    id: 20,
    date: '2022-01-02',
    name: 'Jerry',
    address: '上海市浦东新区浦东南路',
    user: {
      id: 2,
      name: '李四',
      age: 25,
    },
  },
  {
    id: 30,
    date: '2022-01-03',
    name: 'Lily',
    address: '广州市天河区天河路',
    user: {
      id: 3,
      name: '李5',
      age: 30,
    },
  },
  {
    id: 40,
    date: '2022-01-04',
    name: 'Jack',
    address: '深圳市南山区科技中一路',
    user: {
      id: 4,
      name: '赵六',
      age: 35,
    },
  },
])
const table2 = ref([
  {
    id: 10,
    date: '2022-01-01',
    name: 'Tom',
    address: '北京市海淀区西二旗',
    user: {
      name: '张三1',
      id: 1,
      age: 20,
    },
  },
  {
    id: 20,
    date: '2022-01-02',
    name: 'Jerry',
    address: '上海市浦东新区浦东南路2',
    user: {
      id: 2,
      name: '李四',
      age: 25,
    },
  },
  {
    id: 30,
    date: '2022-01-03',
    name: 'Lily',
    address: '广州市天河区天河路1',
    user: {
      id: 3,
      name: '李5',
      age: 30,
    },
  },
  {
    id: 40,
    date: '2022-01-07',
    name: 'Jack',
    address: '深圳市南山区科技中一路',
    user: {
      id: 4,
      name: '赵六',
      age: 35,
    },
  },
])
const visiableDiff = ref(false)
const handleDiffTable = () => {
  visiableDiff.value = true
}
</script>

<style lang="scss" scoped></style>
