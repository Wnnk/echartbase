<template>
<div>
  <el-date-picker
    v-model="date"
    type="dates"
  >

  </el-date-picker>
</div>

</template>

<script setup lang='ts'>
import { ref, watch } from 'vue'
const date = ref([]);

watch(date, (newVal, oldVal) => {
  console.log(newVal, oldVal)
})
</script>

<style lang='scss' scoped>
</style>