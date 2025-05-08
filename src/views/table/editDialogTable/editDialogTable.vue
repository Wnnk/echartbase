<!-- 
  1.点击 -> 深拷贝初始化form数据 -> 记录row用于回写 
  2保存 -> 校验 -> row回写
-->
<template>
  <el-table :data="tableData">
    <el-table-column prop="date" label="日期" width="150"></el-table-column>
    <el-table-column prop="user.name" label="用户" width="150">
    <template #default="{row ,column}" >
      <el-button link type="primary" size="small" @click="showDialog(row)">
        {{ _.get(row, column.property)}}
      </el-button>
    </template>
  </el-table-column>
  <el-table-column prop="address" label="地址" width="150"></el-table-column>
  <el-table-column prop="user.age" label="年龄" width="150"></el-table-column>
  </el-table>
  <el-dialog v-model="dialogVisible">
    <el-form ref="formRef" :model="form" :rules="rules">
      <el-form-item label="id" prop="id">
        {{ form.id }}
      </el-form-item>
      <el-form-item label="name" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="age" prop="age">
        <el-input v-model="form.age"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
        <el-button type="primary" @click="saveData">保存</el-button>
        <el-button @click="handleClose">取消</el-button>
      </template>
  </el-dialog>

</template>

<script setup lang='ts'>
import { nextTick, ref } from 'vue'
import _ from 'lodash'
const tableData = ref([
  {
    id: 1,
    date: '2022-01-01',
    name: 'Tom',
    address: '北京市海淀区西二旗',
    user: {
      name: '张三',
      id: 1,
      age: 20
    }
  },
  {
    id: 2,
    date: '2022-01-02',
    name: 'Jerry',
    address: '上海市浦东新区浦东南路',
    user: {
      id: 2,
      name:'李四',
      age: 25
    }
  },
  {
    id: 3,
    date: '2022-01-03',
    name: 'Lily',
    address: '广州市天河区天河路',
    user: {
      id: 3,
      name:'李5',
      age: 30
    }
  },
  {
    id: 4,
    date: '2022-01-04',
    name: 'Jack',
    address: '深圳市南山区科技中一路',
    user: {
      id: 4,
      name: '赵六',
      age: 35
    }
  }
])

const formRef = ref();
const form = ref({
  id: '',
  name: '',
  age: 0

})
const rules = {
  age: [{ required: true, message: '年龄不能为空，必须为数字', trigger: 'blur', type:'number' }]
}
let row: any
const dialogVisible = ref(false);
const showDialog = (_row: any) => {
  dialogVisible.value = true;
  Object.assign(form.value, _.cloneDeep(_row.user));
  row = _row;
  console.log('第一次无法获取formRef', formRef.value)
  nextTick(() => {
    console.log('necxtTick后获取formRef', formRef.value)
  })
}

const saveData = async() => {
  try {
    const res = await formRef.value.validate();
    console.log('formRef.value.validate', res)
    Object.assign(row.user, _.cloneDeep(form.value));
    dialogVisible.value = false;
  } catch (error) {
    console.log('error', error)
  }
}

const handleClose = async () => { 
  await formRef.value.clearValidate();
  dialogVisible.value = false;
}
  
</script>

<style lang='scss' scoped>
</style>