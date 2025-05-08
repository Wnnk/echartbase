<template>
  <div>
    <el-table :data="tableData" style="width: 100%" @row-click="handleClick">
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>

    <el-dialog v-model="dialogVisible">
      <el-form :model="dialogForm" label-width="120px" v-loading="status === 1" v-if="status !== 3">
        <el-form-item label="id" prop="id">
          <span>{{ dialogForm.id }}</span>
        </el-form-item>
        <el-form-item label="age" prop="age">
          <span>{{ dialogForm.age }}</span>
        </el-form-item>
        <el-form-item label="detail" prop="detail">
          <span>{{ dialogForm.detail }}</span>
        </el-form-item>
      </el-form>
      <div v-else-if="status === 3">
        <p>加载失败,请重试</p>
        <el-button @click="handleClick(filterId)">重试</el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script setup lang='ts'>
import { ref } from 'vue';

/* 0: 未初始化 1: 加载中 2: 加载成功 3: 加载失败 */
const status = ref(0);
const filterId = ref(0);
const tableData = ref([
  {
    id: 1,
    date: '2016-05-03',
    name: 'Tom1',
    address: 'No. 189, Grove St, Los Angeles',
    age: 25,
    detail: 'detail1'
  },
  {
    id: 2,
    date: '2016-05-02',
    name: 'Tom2',
    address: 'No. 189, Grove St, Los Angeles',
    age: 26,
    detail: 'detail2'
  },
  {
    id: 3,
    date: '2016-05-04',
    name: 'Tom3',
    address: 'No. 189, Grove St, Los Angeles',
    age: 27,
    detail: 'detail3'
  },
  {
    id: 4,
    date: '2016-05-01',
    name: 'Tom4',
    address: 'No. 189, Grove St, Los Angeles',
    age: 24,
    detail: 'detail4'
  },
])


const dialogVisible = ref(false);
const dialogForm = ref({
  id: null,
  date: '',
  name: '',
  address: '',
  age: null,
  detail: ''
})

const handleClick = async (row: any) => {
  dialogVisible.value = true;
  /* 初始化表单，不然会出现上一次的表单数据 */
  Object.assign(dialogForm.value, {
    id: '',
    date: '',
    name: '',
    address: '',
    age: null,
    detail: ''
  })
  try {
    status.value = 1;
    filterId.value = row
    const data = await loadData(row.id);
    if(data) {
      Object.assign(dialogForm.value, data);
      status.value = 2
    }
  } catch (error) {
    status.value = 3
  }
 
}

const loadData = (id: number) => {
  /* 模拟异步请求 */
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.7 ? resolve(tableData.value.find(item => item.id === id)) : reject(new Error('加载失败'));
    }, 500)
  })

}




</script>

<style lang='scss' scoped>
</style>