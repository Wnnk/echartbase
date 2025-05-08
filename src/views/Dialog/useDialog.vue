<template>
  <div>
    <h1>Dialog使用界面</h1>
    <el-button @click="selectType">createDialog</el-button>
  </div>

</template>

<script setup lang='ts'>
import { createDialog } from '@/utils/createDialog';
import getTypeComponent from './components/getType.vue'
import { ref } from 'vue';

let visitable = ref(false);
const getTypeDialog = createDialog(getTypeComponent, {
  title: '选择类型1',
});
const selectType = async () => {
  try {
    visitable.value = true;
    const type = await getTypeDialog();
    // console.log(type);
  } catch (error) {
    // console.log(error);
  }
}

</script>

<style lang='scss' scoped>
</style>