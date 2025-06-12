<template>
  <colTable
    :data="data"
    :total="total"
    v-model:checked-options="checkedOptions"
    :columns="columns"
    v-model:searchParams="searchParams"
    :options="tableOptions"
  >
  <template #toolMiddle>
    <span>树型表格Demo</span>
  </template>
  </colTable>
</template>

<script setup lang='ts'>
import { getTreeColumns , getTreeData } from '@/views/table/colTable/api'
import type { ColumnType } from '@/views/table/colTable/type'
import { ref, watch, onMounted } from 'vue'
import colTable from '../colTable/colTable.vue';

const data = ref<any[]>([])
const total = ref(0);
const checkedOptions = ref<ColumnType[]>([]);
const columns = ref<ColumnType[]>([])
const tableOptions = ref({
  status: 0,
  indexLabel: 'No.',
})
const searchParams = ref({
	page: 0,
	size: 10,
})

onMounted( () => {
  columnApi()
})

const columnApi = async () => {
  try {
    tableOptions.value.status = 1
    columns.value = await getTreeColumns() as ColumnType[]
    checkedOptions.value = JSON.parse(JSON.stringify(columns.value))
    await dataApi()
    tableOptions.value.status = 2
  } catch (error) {
    tableOptions.value.status = 3
  }
}

const dataApi = async () => {
  try {
    tableOptions.value.status = 1
    const res  =  await getTreeData(searchParams.value) as any
    data.value = res.data
    total.value = res.total
    tableOptions.value.status = 2
  } catch (error) {
    tableOptions.value.status = 3
  }
}

watch(
  () => searchParams.value,
  () => {
    console.log('searchParams', searchParams.value)
    dataApi()
  },
)
</script>

<style lang='scss' scoped>
</style>