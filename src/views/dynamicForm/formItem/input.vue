<template>
  <el-form-item :label="widget.labelHidden ? undefined : widget.props.label">
    <el-input v-model="value" v-if="widget.type === 'input'"></el-input>
    <el-input v-model="value" v-else-if="widget.type === 'textarea'"></el-input>
    <el-input v-model="value" v-else-if="widget.type === 'password'"></el-input>
    <el-input v-model="value" v-else-if="widget.type === 'number'"></el-input>
    <el-input v-model="value" v-else-if="widget.type === 'email'"></el-input>
  </el-form-item>
</template>

<script setup lang="ts">
import { ref, reactive, inject } from 'vue'
import type { Widget } from '../type'
import type { PropType } from 'vue'



const props = defineProps({
  widget: {
    type: Object as PropType<Widget>,
    required: true,
  },
  rules: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
})
const { widget, rules } = props
const value = defineModel()
console.log(widget)
</script>

<style lang="scss" scoped></style>
