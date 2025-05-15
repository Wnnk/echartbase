<template>
  <div>
    <h1>使用Table组件界面</h1>
    <el-button @click="handleDiffTable">Diff Table</el-button>
    <diff-table v-if="visiableDiff" :origin-data="table1" :new-data="table2" />
    <!-- <diff-test :origin-data="table1" :new-data="table2" /> -->
  </div>
  <div>
    <h1>带分页器的table组件</h1>
    <paginate-table  :store="store">
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
    </paginate-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import diffTable from '@/components/diffTable/diffTable.vue'
import diffTest from '@/components/diffTable/diffTest.vue'
import paginateTable from './PaginateTable/paginateTable.vue'
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
          data:{
            data:[{
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
            }
          ],
          count: 100,
          page:params.page,
          },
        })
      },200)
    })
  },
  writter(options:any){
    return {
      page: options.page,
    }
  },
  reader(res:any) {
    if(res.code == 200){
      return {
        data: res.data.data,
        count: res.data.count,
        page: res.data.page,
      }
    }
    
    throw new Error('结构转换错误')
  }
})
</script>

<style lang="scss" scoped></style>
