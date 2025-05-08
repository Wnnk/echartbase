<template>
  <span>选择商品</span>
  <div>
    <span>
      <el-button @click="handleCancel">取消</el-button>
      <el-button @click="handleOk">确定</el-button>
    </span>
  </div>

</template>

<script setup lang='ts'>
import { getCurrentInstance, defineEmits } from 'vue';
const emit = defineEmits(['cancel','ok']);
const ctx = getCurrentInstance();
const handleOk = () => {
  emit('ok',[1,2,3]);
};
const handleCancel = () => {
  emit('cancel',[4,5,6]);
}
</script>

<style lang='scss' scoped>
</style>