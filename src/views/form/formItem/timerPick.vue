<!-- 
  @description: 时间选择器的多值处理
-->

<template>
  {{ value}}
  <el-time-picker 
    v-bind="$attrs"
    v-model="value"
    is-range
  >
</el-time-picker>


</template>


<script setup lang='ts' name="timerPick">
import { reactive, ref, computed, watch } from 'vue';
const props = defineProps({
  start: {
    type: Date || null,
    default: null,
    required: true
  },
  end: {
    type: Date || null,
    default: null,
    required: true
  }
})

const emits = defineEmits(['update:start', 'update:end']);
const value = computed<[Date | null, Date | null] >({
  get() {
    return [props.start, props.end]
  },
  set(val) {
    const [start, end] = val || [null, null];
    console.log('value change',start, end)
    emits('update:start', start);
    emits('update:end', end);
  
  }
})
watch(
  () => props.start,
  (val) => {
    console.log('start change', val)
   if(!value.value || value.value[1] === null) {
    value.value = [val, null];
   } else {
    value.value[0] = val;
   }
  },
  { deep: true }
)
watch(
  () => props.end,
  (val) => {
    console.log('end change', val)
   if(!value.value || value.value[0] === null) {
    value.value = [null, val];
   } else {
    value.value[1] = val;
   }
  },
  { deep: true }
)
</script>

<style lang='scss' scoped>
</style>