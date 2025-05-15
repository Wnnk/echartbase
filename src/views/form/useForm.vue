<!-- form组件使用页面 -->

<template>
  <div>
    <div>
      <h1>时间选择器</h1>
      {{ form }}
      <timerPick 
        v-model:start="form.start" 
        v-model:end="form.end" 
        range-separator="至" 
        start-placeholder="开始时间" 
        end-placeholder="结束时间" 
      />
    </div>

  </div>

</template>

<script setup lang='ts'>
import timerPick from '@/views/form/formItem/timerPick.vue';
import { reactive } from 'vue';
const form = reactive({
  start: new Date(2016, 9, 10, 10, 30, 0),
  end: new Date(2016, 9, 10, 12, 30, 0)
})
</script>

<style lang='scss' scoped>
</style>