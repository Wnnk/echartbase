<template>
  <div>
    <el-table :data="tableData" style="width: 70vw" v-loading="status === 1">
      <el-table-column label="Equipment Name" prop="equipmentName" />
      <el-table-column label="temperature" prop="temperature"></el-table-column>
      <el-table-column label="humidity" prop="humidity"></el-table-column>
      <el-table-column label="pressure" prop="pressure"></el-table-column>
      <!-- <template #empty v-if="status === 3">
        <div>
          <el-button>Retry</el-button>
        </div>
      </template>
      <template #empty v-if="status === 2 && tableData.length === 0">
        <div>
          <p>数据为空</p>
        </div>
      </template> -->
    </el-table>
    <br>
    <el-pagination
      :total="total"
      :page-size="pageSize"
      v-model="currentPage"
      @current-change="turnPage"
      background 
      layout="prev, pager, next"
     
    />
  </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { createTabledata } from '@/api/table/getTable';
import type { Equipment } from '@/api/table/getTable';
import request from '@/request/request';
import axios from 'axios';




const tableData = ref<Array<Equipment>>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
/* 0:未初始化, 1:加载中 2:加载完成 3:加载失败 */
const status = ref(0);


let currentAbortController: AbortController | null = null;

const init = async (start: number, end: number) => {
  try {
    // 取消之前的请求
    if (currentAbortController) {
      currentAbortController.abort('取消旧请求');
      currentAbortController = null;
    }

    // 创建新的控制器
    currentAbortController = new AbortController();
    
    status.value = 1;
    const res = await request.get(`/equipment?start=${start}&end=${end}`, {}, {
      signal: currentAbortController.signal  // 关键：必须传递signal
    });


    // 只有未被取消的请求才会执行到这里
    tableData.value = res.data;
    currentPage.value = 1;
    pageSize.value = 10;
    total.value = res.count;
    status.value = 2;
    
  } catch (error) {
    // 区分是取消错误还是真实错误
    if (axios.isCancel(error)) {
      console.log('请求被取消:', error.message);
    } else {
      status.value = 3;
      console.error('请求错误:', error);
    }
  } finally {
    currentAbortController = null;
  }
}
const turnPage = (page: number) => {
  const start = (page - 1) * pageSize.value;
  const end = start + pageSize.value;
  init(start, end);
}

onMounted(() => {
  init(0,10);
});


</script>

<style lang='scss' scoped>
</style>