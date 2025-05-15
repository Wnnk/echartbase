<!-- 
  @description: 带分页器的table组件
-->
<template>
  <div>
    <div v-if="status === 3">有错误<el-button @click="reTry">重试</el-button></div>
    <el-table v-bind="$attrs" :data="tableData" v-loading="status === 1">
     <slot></slot>
    </el-table>
    <el-pagination 
      background 
      layout="total,size , prev, pager, next" 
      :total="total"
      :current-page="currentPage"
      @current-change="currentChange" 
    ></el-pagination>
  </div>

</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'
const props = defineProps({
  store: {
    type: Object,
    required: true
  },
})
const tableData = ref([]);
const status = ref(0);
const total = ref(0);
const currentPage = ref(1);
let preParams = {};


const reTry = () => {
  fetch(preParams);
} 

const fetch = async (params: any) => {
  return props.store.load(params);
}

const load = async (options: any = {page: 1}) => {
  try {
    const params =  props.store.writter({
      page: options.page,
      count: options.count || total.value,
    })
    status.value = 1;
    preParams = params;
    const result = await props.store.load(params);
    const { data, count, page } = props.store.reader(result);
    tableData.value = data;
    total.value = count;
    currentPage.value = page;
    status.value = 2;
  } catch (error) {
    status.value = 3;
  }
}
const currentChange = (nextPage: number) => {
  load({page: nextPage});
}

onMounted(() => {
  load();
})
</script>

<style lang='scss' scoped>
</style>