<template>
  <div :style="{ background: '#f2f3f5' }">
    <h1>动态列</h1>
    <col-table :columns="columns" :data="table1" :options="{ indexLabel: 'No.', loading: true }" />
  </div>
  <div>
    <h1>读取XLSX table组件</h1>
    <ReadXlsx />
  </div>
  <div>
    <h1>download(含表头,表尾)组件</h1>
    <xlsx-table />
  </div>
  <div>
    <h1>XLSX Table</h1>
    <download v-if="false" />
  </div>
  <div>
    <h1>loading table组件</h1>
    <load-table v-if="false"></load-table>
  </div>
  <div>
    <h1>checkboxTable组件</h1>
    <checkbox-table :data="table" :checkgroup="checkgroup" v-if="TableStatus === 2" />
  </div>
  <div>
    <h1>使用Table组件界面</h1>
    <el-button @click="handleDiffTable">Diff Table</el-button>
    <diff-table v-if="visiableDiff" :origin-data="table1" :new-data="table2" />
    <!-- <diff-test :origin-data="table1" :new-data="table2" /> -->
  </div>
  <div>
    <h1>带分页器的table组件</h1>
    <paginate-table :store="store">
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
    </paginate-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import diffTable from '@/components/diffTable/diffTable.vue'
import diffTest from '@/components/diffTable/diffTest.vue'
import paginateTable from './PaginateTable/paginateTable.vue'
import checkboxTable from './threadTable/checkboxTable.vue'
import loadTable from './threadTable/loadTable.vue'
import download from './download/download.vue'
import checkTable from './threadTable/checkTable.vue'
import xlsxTable from './xlsxTable/xlsxTable.vue'
import { getTableData, getDefined } from './tableData'
import ReadXlsx from './xlsxTable/readXlsx.vue'
import colTable from './colTable/colTable.vue'
import { first } from 'lodash'

const table = ref([])
const TableStatus = ref(0)
const checkgroup = ref([])
const api = async () => {
  try {
    TableStatus.value = 1
    const res = (await getTableData()) as any
    const defined = (await getDefined()) as any
    checkgroup.value = defined
    table.value = res.data
    TableStatus.value = 2
  } catch (error) {
    TableStatus.value = 3
  }
}
api()

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

/* 分页器组件参数 */
const store = ref({
  load(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: {
            data: [
              {
                date: '2022-01-01',
                name: `Tom${params.page}`,
                address: '北京市海淀区西二旗',
              },
              {
                date: '2022-01-02',
                name: `Jerry${params.page}`,
                address: '上海市浦东新区浦东南路',
              },
              {
                date: '2022-01-03',
                name: `Lily${params.page}`,
                address: '广州市天河区天河路',
              },
              {
                date: '2022-01-04',
                name: `Jack${params.page}`,
                address: '深圳市南山区科技中一路',
              },
            ],
            count: 100,
            page: params.page,
          },
        })
      }, 200)
    })
  },
  writter(options: any) {
    return {
      page: options.page,
    }
  },
  reader(res: any) {
    if (res.code == 200) {
      return {
        data: res.data.data,
        count: res.data.count,
        page: res.data.page,
      }
    }

    throw new Error('结构转换错误')
  },
})

/* 动态列数据 */
const columns = ref([
  {
    label: 'ID',
    prop: 'id',
    width: 100,
  },
  {
    label: '日期',
    prop: 'date',
    width: 150,
  },
  {
    label: '姓名',
    prop: 'name',
    width: 150,
  },
  {
    label: '地址',
    prop: 'address',
    width: 200,
  },
  {
    label: '用户',
    width: 360,
    children: [
      {
        label: '用户ID',
        width: 120,
        prop: 'user.id',
      },
      {
        label: '用户姓名',
        width: 120,
        prop: 'user.name',
      },
      {
        label: '用户年龄',
        width: 120,
        prop: 'user.age',
      },
    ],
  },
])
</script>

<style lang="scss" scoped></style>
