<template>
  <col-table
    v-model:search-params="searchParams"
    v-model:checked-options="checkedOptions"
    :columns="columns"
    :data="data"
    :options="tableOptions"
    :total="total"
    @delete-rows="deleteRows"
    @add-data="addData"
  >
    <template #toolMiddle>
      <span>中间自定义工具栏</span>
    </template>
    <el-table-column type="expand" width="50px">
      <template #default="{ row }">
        <div>
          <span>展开后显示的名字: {{ row.name }}</span>
        </div>
      </template>
    </el-table-column>
    <template #append>
      <div>自定义尾部</div>
    </template>
    <template #empty>
      <div>自定义空数据</div>
    </template>
  </col-table>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import colTable from '@/views/table/colTable/colTable.vue'
import type { ColumnType } from '@/views/table/colTable/type'
import { getTableColumns, getColumnsData } from '@/views/table/colTable/api'

const columns = ref<ColumnType[]>([])
const total = ref(0);
const checkedOptions = ref<ColumnType[]>([]);
const data = ref<any[]>([]);
const tableOptions = ref({
  status: 0,
  indexLabel: 'No.',
  showSummary: true,
})
const searchParams = ref({
	page: 0,
	size: 10,
})
onMounted(() => {
  columnApi()
})
const columnApi = async () => {
  try {
    columns.value = await getTableColumns() as ColumnType[]
    checkedOptions.value = JSON.parse(JSON.stringify(columns.value))
    dataApi()
  } catch (error) {
    console.log(error)
  }
}
const dataApi = async () => {
  try {
    tableOptions.value.status = 1
    const res = await getColumnsData(searchParams.value) as any
    data.value = res.data;
    total.value = res.total;
    tableOptions.value.status = 2
  } catch (error) {
    tableOptions.value.status = 3
  }
}

watch(
  () => searchParams.value,
  () => {
    dataApi()
  },
)



onMounted(() => {
	// 尝试搜索
	searchParams.value = {
		...searchParams.value,
		page: 1
	}
})

const deleteRows = (rows: any[]) => {
  try {
    tableOptions.value.status = 1
    data.value = data.value.filter((item) => !rows.includes(item))
    dataApi()
    tableOptions.value.status = 2
  } catch (error) {
    tableOptions.value.status = 3
  }
}

const addData = (row: any) => {
  try {
    tableOptions.value.status = 1
    data.value.push(row)
    tableOptions.value.status = 2
  } catch (error) {
    tableOptions.value.status = 3
  }
}

</script>

<style lang="scss" scoped></style>
