<!-- 
  @description: table 动态列
    1.根据json可多级表头嵌套
    2.基本编辑功能新增、删除，可支持自定义    
-->

<template>
  <div class="table" :style="{ width: `${tableWidth}px` }">
    <div class="table-tool">
      <div>
        <slot name="toolLeft">
          <el-button type="primary" size="default"
            >新增<el-icon><Plus /></el-icon
          ></el-button>
          <el-button type="danger" size="default"
            >删除
            <el-icon><Delete /></el-icon>
          </el-button>
        </slot>
      </div>
      <div>
        <slot name="toolRight">
          <el-tooltip placement="top" content="刷新">
            <el-button size="small">
              <el-icon><RefreshRight /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip placement="top" content="全屏">
            <el-button size="small" @click="toggleFullScreen">
              <el-icon><ZoomIn /></el-icon
            ></el-button>
          </el-tooltip>
          <el-tooltip placement="top" content="视图">
            <el-button size="small" @click="popoverOutside" ref="viewButton">
              <el-icon><View /></el-icon>
            </el-button>
          </el-tooltip>
        </slot>
      </div>
    </div>

    <div class="table-container">
      <el-table :data="data" v-bind="$attrs">
        <el-table-column
          width="100"
          :label="options.indexLabel"
          type="index"
          v-if="options.indexLabel"
        ></el-table-column>
        <el-table-column type="selection" width="50"></el-table-column>
        <col-table-column v-for="(column, index) in columns" :column="column"> </col-table-column>
        <el-table-column label="操作" width="100"></el-table-column>
      </el-table>
    </div>

    <div class="table-footer">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="pageChange"
        @size-change="pageSizeChange"
      >
      </el-pagination>
    </div>
  </div>

  <tableColumnsPopover ref="viewPopover" :virtual-ref="viewButton" />
</template>

<script setup lang="ts">
import { computed, ref, provide, unref } from 'vue'
import colTableColumn from './colTableColumn.vue'
import type { ColumnType } from './type.ts'
import { tableProps } from './type.ts'
import tableColumnsPopover from './components/tableColumnsPopover.vue'

const { columns, data, searchParams, options } = defineProps(tableProps)
const emit = defineEmits(['update:searchParams'])

/**
 * @description: 计算表格宽度
 * @param arr 列配置
 * @param width 初始宽度
 * @return number 表格宽度
 */
const tableWidth = ref(0)
const getColumnWidth = (arr: ColumnType[], width: number = 0) => {
  arr.forEach((item) => {
    if (item.width) {
      width += item.width
    } else if (item.children && item.children.length > 0 && !item.width) {
      width += getColumnWidth(item.children, width)
    } else {
      width += 100
    }
  })
  return width
}
/**
 * @description: 最终计算表格宽度,有额外的列（序号列，选择列，操作列）需要补偿宽度
 */
const getTableWidth = () => {
  const width = getColumnWidth(columns)
  return width + 250
}
/* 初始化宽度 */
tableWidth.value = getTableWidth() > window.innerWidth ? window.innerWidth : getTableWidth()

const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(100)
const pageChange = (page: number) => {
  emit('update:searchParams', {
    ...searchParams,
    page,
  })
}
const pageSizeChange = (size: number) => {
  emit('update:searchParams', {
    ...searchParams,
    size,
  })
}

/**
 * @description： 全屏
 */
const isFullScreen = ref(false)
const toggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
  if (isFullScreen.value) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

/**
 * @description: popover显示
 */
const viewPopover = ref()
const viewButton = ref<HTMLButtonElement | null>()
const viewPopoverVisible = ref(false)
const popoverOutside = () => {
  unref(viewPopover).popperRef?.delayHide?.()
}
</script>

<style lang="scss" scoped>
@use './colTable.scss';
</style>
