<template>
  <el-dialog v-model="isDiff" title="数据差异对比" width="70%">
    <el-table :data="diff" border style="width: 100%">
      <el-table-column prop="key" label="属性路径" width="250"></el-table-column>
      <el-table-column label="旧值" width="300">
        <template #default="{ row }">
          <span :class="{ 'diff-old': row.hasDiff }">{{ row.oldValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="新值" width="300">
        <template #default="{ row }">
          <span :class="{ 'diff-new': row.hasDiff }">{{ row.newValue }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="diff-legend">
      <span class="diff-legend-item">
        <span class="diff-legend-marker diff-new"></span> 修改后的值
      </span>
      <span class="diff-legend-item">
        <span class="diff-legend-marker diff-old"></span> 修改前的值
      </span>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface DiffItem {
  key: string
  oldValue: any
  newValue: any
  hasDiff: boolean
}

interface Props {
  originData: Record<string, any>
  newFormData: Record<string, any>
}

const props = defineProps<Props>()
const isDiff = defineModel<boolean>('visible', { default: false })
const diff = ref<DiffItem[]>([])

const findValueDiff = (
  oldObj: any,
  newObj: any,
  path = '',
): Record<string, { oldValue: any; newValue: any }> => {
  const diff: Record<string, { oldValue: any; newValue: any }> = {}
  const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)])

  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key

    if (!(key in oldObj)) {
      diff[currentPath] = { oldValue: undefined, newValue: newObj[key] }
      continue
    }

    if (!(key in newObj)) {
      diff[currentPath] = { oldValue: oldObj[key], newValue: undefined }
      continue
    }

    const oldValue = oldObj[key]
    const newValue = newObj[key]

    if (
      typeof oldValue === 'object' &&
      oldValue !== null &&
      typeof newValue === 'object' &&
      newValue !== null
    ) {
      const nestedDiff = findValueDiff(oldValue, newValue, currentPath)
      Object.assign(diff, nestedDiff)
    } else if (oldValue !== newValue) {
      diff[currentPath] = { oldValue, newValue }
    }
  }

  return diff
}

const formatValue = (value: any): string => {
  if (value === undefined) return 'undefined'
  if (value === null) return 'null'
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}

const formatDiffToArray = (
  diffObj: Record<string, { oldValue: any; newValue: any }>,
): DiffItem[] => {
  return Object.entries(diffObj).map(([key, values]) => ({
    key,
    oldValue: formatValue(values.oldValue),
    newValue: formatValue(values.newValue),
    hasDiff: values.oldValue !== values.newValue,
  }))
}

watch(
  () => [props.originData, props.newFormData],
  () => {
    const result = findValueDiff(props.originData, props.newFormData)
    diff.value = formatDiffToArray(result)
  },
  { immediate: true, deep: true },
)
</script>

<style lang="scss" scoped>
.diff-old {
  color: #f56c6c;
  font-weight: bold;
}

.diff-new {
  color: #67c23a;
  font-weight: bold;
}

.diff-legend {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
}

.diff-legend-item {
  display: inline-block;
  margin: 0 15px;
}

.diff-legend-marker {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 5px;
  border-radius: 2px;
}

.diff-legend-marker.diff-old {
  background-color: #f56c6c;
}

.diff-legend-marker.diff-new {
  background-color: #67c23a;
}
</style>
