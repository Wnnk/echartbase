<template>
  <el-form-item :label="widget.labelHidden ? undefined : widget.props.label">
    <el-time-picker v-model="id"> </el-time-picker>
  </el-form-item>
  
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { Widget } from '../type'
import type { PropType } from 'vue'
const props = defineProps({
  widget: {
    type: Object as PropType<Widget>,
    required: true,
  },
})

const id = defineModel()
</script>

<style lang="scss" scoped></style>
