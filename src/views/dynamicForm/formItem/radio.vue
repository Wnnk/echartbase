<template>
  <el-form-item>
    <el-radio-group v-model="id">
      <el-radio v-for="option in options" :value="option.label" :key="option.value">
        {{ option.label }}
      </el-radio>
    </el-radio-group>
  </el-form-item>
  
</template>

<script setup lang="ts">
import { ref, reactive, defineModel } from 'vue'
import type { Option } from './type'
import type { PropType } from 'vue'

const props = defineProps({
  options: {
    type: Array as PropType<Option[]>,
    required: true,
  },
})
const id = defineModel()
</script>

<style lang="scss" scoped></style>
