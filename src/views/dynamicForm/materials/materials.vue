<template>
  <el-collapse>
    <el-collapse-item title="基础组件" name="basic">
      <div v-for="(item,index) in widget" :key="index" class="form-material">
        <el-button  @click="addField(item.type)">{{ item.props.label }}</el-button>
      </div>
    </el-collapse-item>
    <el-collapse-item title="容器" name="container"></el-collapse-item>
    <el-collapse-item titlr="高阶组件" name="advance"></el-collapse-item>
  </el-collapse>

</template>

<script setup lang='ts'>
import { ref, inject } from 'vue'
import { widget } from '@/views/dynamicForm/widget';
import { useField } from '../hooks/useFieeld';

const { addField }  = useField(widget);
const jsonSchema = inject("jsonSchema")!


const activeCollapse = ref([]);

</script>

<style lang='scss' scoped>
  .form-material {
    height: 50px;
    display: flex;
    justify-content: center;
  }
</style>