<template>
  <el-table :data="tableData"> 
    <el-table-column prop="date" label="日期"></el-table-column>
    <el-table-column prop="user" label="参与人">
      <template #default="{row,column}">
        <el-button link type="primary" size="small" @click="showDialogHandler(row,column,_.get(row,column.property))">
          {{ row.user.map((item:any) => item.name).join(',') }}
        </el-button>
      </template>
    </el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
  </el-table>

  <el-dialog v-model="dialogVisible" :before-close="handleClose">
    <div>
      当前选中元素【{{ selectedData.length }}】个：<el-tag v-for="item in selectedData">{{ item }}</el-tag>
    </div>
    <el-table 
      :data="dialogData"  
      row-key="id" 
      ref="tableRef" 
      v-loading="status === 1" 
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" reserve-selection></el-table-column>
      <el-table-column label="id" prop="id"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
    </el-table>
  </el-dialog>

</template>

<script setup lang='ts'>
import { nextTick, ref } from 'vue'
import _, { before } from 'lodash'
const tableData = [
  {
    id:'1',
    date:'2022-01-01',
    user:[{
      id:'1',
      name:'张三'
    }],
    address:'北京市'
  },
  {
    id:'2',
    date:'2022-01-02',
    user:[{
      id:'2',
      name:'李四'
    }],
    address:'上海市'
  },
  {
    id:'3',
    date:'2022-01-03',
    user:[{
      id:'3',
      name:'王五'
    }],
    address:'广州市'
  },
  {
    id:'4',
    date:'2022-01-04',
    user:[{
      id:'4',
      name:'赵六'
    }],
    address:'深圳市'
  }
]
const dialogVisible = ref(false);
const dialogData = ref<any[]>([]);
const selectedData = ref<any[]>([]);
const status = ref(0);
const tableRef = ref();
let row:any;
let column:any;
let filter = {
  page: 1,
}
const showDialogHandler = (_row:any,_column:any,_selectedData:any) => {
  row = _row;
  column = _column
  dialogVisible.value = true;
  selectedData.value = _.cloneDeep(_selectedData);
  filter.page = 1;
  loadHandler();
}
let flag = false;
const loadHandler = async () => {
  try {
    status.value = 1;
    const data = await api(filter) as any[];
    dialogData.value = data as any[];
    status.value = 2;
    const rows = _.intersectionWith(data,selectedData.value,(a:any,b:any) => a.id === b.id);
    
    nextTick(() => {
      flag = true;
      rows.forEach((row:any) => {
        tableRef.value.toggleRowSelection(row,true);
      })
      flag = false;
    })
  } catch (error) {
    status.value = 3;
  }
}


const handleSelectionChange = (val:any) => {
  if(flag) return;
  selectedData.value = val;
}


const handleClose = (next:any) => {
  setTimeout(() => {
    tableRef.value.clearSelection();
  }, 100)
  next();
}


const api = async ({page}:any) => {
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      const data = Array(10).fill(0).map((_,index) => ({
        id:`${(page - 1) * 10 + index + 1}`,
        name:`姓名${Math.random()}`,
        age: `${Math.floor(Math.random() * 100)}岁`,
      }))
      resolve(data);
    }, 1000)
  })
}


</script>

<style lang='scss' scoped>
</style>