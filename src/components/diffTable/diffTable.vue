<template>
  <el-table :data="diffData" border style="width: 100%" row-key="id">
    <el-table-column prop="key" label="属性" width="180" />
    <el-table-column label="旧值">
      <template #default="{ row }">
        <span :class="{ 'diff-old': row.hasDiff }">{{ row.oldValue }}</span>
      </template>
    </el-table-column>
    <el-table-column label="新值">
      <template #default="{ row }">
        <span :class="{ 'diff-new': row.hasDiff }">{{ row.newValue }}</span>
      </template>
    </el-table-column>
    <el-table-column label="状态" width="100">
      <template #default="{ row }">
        <el-tag :type="getStatusType(row)" size="small">
          {{ getStatusText(row) }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import _ from 'lodash'

const props = defineProps({
  originData: {
    type: Array,
    default: () => [],
  },
  newData: {
    type: Array,
    default: () => [],
  },
  compareKey: {
    type: String,
    default: 'id',
  },
})

// 格式化显示的值
const formatValue = (value: any) => {
  if (_.isObject(value) && !_.isArray(value)) {
    return JSON.stringify(value, null, 2)
  }
  if (_.isArray(value)) {
    return `[${value.join(', ')}]`
  }
  return value
}

// 获取状态标签类型
const getStatusType = (row: any) => {
  if (row.oldValue === undefined) return 'success' // 新增
  if (row.newValue === undefined) return 'danger' // 删除
  return 'warning' // 修改
}

// 获取状态文本
const getStatusText = (row: any) => {
  if (row.oldValue === undefined) return '新增'
  if (row.newValue === undefined) return '删除'
  return '修改'
}

// 找出所有差异数据
const findDiffValues = (originData: any, newData: any, path: string = '') => {
  const diff: Record<string, { oldValue: any; newValue: any }> = {}
  const allKeys = new Set([...Object.keys(originData || {}), ...Object.keys(newData || {})])

  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key
    if (!(key in originData)) {
      diff[currentPath] = {
        oldValue: undefined,
        newValue: newData[key],
      }
    }
    if (!(key in newData)) {
      diff[currentPath] = {
        oldValue: originData[key],
        newValue: undefined,
      }
    }

    const oldValue = originData?.[key]
    const newValue = newData?.[key]
    if (
      typeof oldValue === 'object' &&
      oldValue !== null &&
      typeof newValue === 'object' &&
      newValue !== null
    ) {
      const nestedDiff = findDiffValues(oldValue, newValue, currentPath)
      Object.assign(diff, nestedDiff)
    } else if (oldValue !== newValue) {
      diff[currentPath] = { oldValue, newValue }
    }
  }
  return diff
}

const formatDiffToArray = (diffObj: Record<string, { oldValue: any; newValue: any }>) => {
  return Object.entries(diffObj).map(([key, values]) => ({
    key,
    oldValue: formatValue(values.oldValue),
    newValue: formatValue(values.newValue),
    hasDiff: values.oldValue !== values.newValue,
  }))
}

// // 计算差异数据
const diffData = computed(() => {
  const res = findDiffValues(props.originData, props.newData)
  const diffArr = formatDiffToArray(res)
  return diffArr
})
</script>

<style scoped>
.text-gray-400 {
  color: #9ca3af;
}
</style>
