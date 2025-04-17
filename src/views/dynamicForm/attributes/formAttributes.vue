<template>
  <el-form v-model="formConfig" v-if="formConfig">
    <el-form-item label="全局组件大小">
      <el-select v-model="formConfig.size">
        <el-option label="default" value="default"></el-option>
        <el-option label="small" value="small"></el-option>
        <el-option label="large" value="large"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="标签位置">
      <el-button-group>
        <el-button size="small">左边</el-button>
        <el-button size="small">顶部</el-button>
      </el-button-group>
    </el-form-item>
    <el-form-item label="标签宽度">
      
      <el-input-number :step="1" v-model="formConfig.labelWidth">{{ formConfig.labelWidth }}</el-input-number>
    </el-form-item>
  </el-form>

</template>

<script setup lang='ts'>
import { ref, inject } from 'vue'
import type { FormConfig } from '@/views/dynamicForm/type'
const formConfig:FormConfig | undefined = inject('formConfig');
</script>

<style lang='scss' scoped>
</style>