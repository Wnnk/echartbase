<template>
  <div>
    <el-table :data="tableData" width="100%" >
      <el-table-column prop="date" label="日期" width="150"></el-table-column>
      <el-table-column prop="name" label="用户" width="150">
      <template #default="{row ,column}" >
        <el-button link type="primary" size="small" @click="showDialog(row)">
          {{ _.get(row, column.property)}}
        </el-button>
      </template>
    </el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
    </el-table>
  
    <el-dialog v-model="dialogVisible" >
      <el-form ref="formRef" :model="form" v-if="status !== 3" v-loading="status === 1">
        <el-form-item label="id">
          {{ form.id }}
        </el-form-item>
        <el-form-item label="name" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="age" prop="age">
          <el-input v-model.number="form.age"></el-input>
        </el-form-item>
      </el-form>
      <div v-else>
        <p>加载失败</p>
        <el-button type="primary" @click="handletry">重试</el-button>
      </div>
      <template #footer>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="sumbit()" v-loading="saveStatus === 1">确 定</el-button>
          <el-button type="primary" @click="handleClose()">取 消</el-button>
        </div>
      </template>
      
      
    </el-dialog>
  </div>

</template>

<script setup lang='ts'>
import {  ref } from 'vue'
import _ from 'lodash'
import { ElMessage } from 'element-plus';
const tableData = ref([
  {id:1, date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄'},
  {id:2, date: '2016-05-02', name: '王五虎', address: '上海市普陀区金沙江路 1'},
  {id:3, date: '2022-01-01', name: '张三', address: '北京市'},
  {id:4, date: '2022-01-02', name: '李四', address: '上海市'}
])
/* 0:未初始化， 1：加载中， 2：加载成功， 3：加载失败 */
const status = ref(0);
const dialogVisible = ref(false);
const formRef = ref();
let row:any = null;
const form = ref<any>({
  id: null,
  name: null,
  age: null,
});
const saveStatus = ref(0);

const showDialog = (_row:any) => {
  dialogVisible.value = true;
  Object.assign(form.value, {
    id: '',
    name: '',
    age: '',
  });
  row = _row;
  loadData();
}

const loadData = async () => {
  status.value = 1;
  try {
    const data = await api(row.id);
    form.value = data;
    status.value = 2;
  } catch (error) {
    status.value = 3;
  }
}

const api = (id:number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.5 ? resolve({
        id: id,
        age:Math.floor(Math.random() * 50),
        name: tableData.value.find(item => item.id === id)?.name || '未知'
      }) : reject('加载失败')
    }, 500)
  })
}
const handletry = async () => {
  try {
    status.value = 1;
    const data = await api(row.id);
    console.log(data);
    Object.assign(form.value, data);
    status.value = 2;
  } catch (error) {
    status.value = 3;
  }
}


const sumbit = async () => {
  if(saveStatus.value === 1) return;
  try {
    await formRef.value.validate();
    await handleSave();
    dialogVisible.value = false;
    /* 回写 / 重新获取table数据 */
    Object.assign(row,{
      name: form.value.name,
      age: form.value.age,
    }) 
    ElMessage.success('保存成功');
  } catch (error) {
    if(error === 'error') {
      ElMessage.error('保存失败');
    }
  }
}


const handleSave = async () => {
  try {
    saveStatus.value = 1;
    const result = await saveApi(row.id, form.value);
    saveStatus.value = 2;
    return result;
  } catch (error) {
   saveStatus.value = 3;
    throw error;
  }
}

const saveApi = (id:number, data:any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.5 ? resolve('success') : reject('error')
    }, 500)
  })
}

const handleClose = () => {
  formRef.value.clearValidate();
  dialogVisible.value = false;
}
</script>

<style lang='scss' scoped>
</style>