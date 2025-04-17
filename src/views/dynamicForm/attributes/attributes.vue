<template>
 <el-tabs v-model="activeAttr">
    <el-tab-pane name="form-item-attributes" label="组件属性"><ComponentAttributes /></el-tab-pane>
    <el-tab-pane nale="form-attributes" label="表单属性"><FormAttributes /></el-tab-pane>
  </el-tabs>

</template>

<script setup lang='ts'>
import { ref } from 'vue'
import FormAttributes from './formAttributes.vue';
import ComponentAttributes from './componentAttributes.vue';
const activeAttr = ref<string>('form-item-attributes')
</script>

<style lang='scss' scoped>
</style>