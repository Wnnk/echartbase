<template>
  <el-form-item>
    <el-select v-model="value" :placeholder="widget.props.placeholder">
      <el-option
        v-for="option in widget?.props.options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      >
      </el-option>
    </el-select>
  </el-form-item>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PropType } from 'vue'
import type { Widget } from '../type'

const props = defineProps({
  widget: {
    type: Object as PropType<Widget>,
    required: true,
  },
  currentItem: {
    type: Object as PropType<any>,
  },
})
const { widget, currentItem } = props
const value = defineModel()
</script>
