<!-- 
  @description: table 动态列
    1.根据json可多级表头嵌套
    2.基本编辑功能新增、删除，可支持自定义
    3.全屏，刷新，动态列
    4.分页
    5.新增动态数据
    6.根据内容自动调整列宽    
-->

<template>
  <div class="table">
    <div class="table-tool">
      <div>
        <slot name="toolLeft">
          <el-button type="primary" size="default" @click="addDataDialog = true"
            >新增<el-icon><Plus /></el-icon
          ></el-button>
          <el-button type="danger" size="default" @click="deleteRows"
            >删除
            <el-icon><Delete /></el-icon>
          </el-button>
        </slot>
      </div>
      <div>
        <slot name="toolMiddle"></slot>
      </div>
      <div>
        <slot name="toolRight">
          <el-tooltip placement="top" content="刷新">
            <el-button size="small" @click="refresh">
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
      <el-table
        :data="data"
        ref="tableRef"
        v-loading="unref(computedOptions).status === 1"
        v-bind="unref(computedOptions)"
        @row-click="onRowClick"
      >
        <el-table-column
          width="100"
          :label="options.indexLabel"
          type="index"
          v-if="options.indexLabel"
        ></el-table-column>
        <el-table-column type="selection" width="50"></el-table-column>
        <col-table-column v-for="(column, index) in checkedOptions" :column="column">
        </col-table-column>
        <template #append>
          <slot name="append"></slot>
        </template>
        <template #empty>
          <slot name="empty"></slot>
        </template>
      </el-table>
    </div>

    <div class="table-footer">
      <el-pagination
        v-model:current-page="searchParams.page"
        v-model:page-size="searchParams.size"
        :total="total"
        :layout="unref(computedOptions).layout"
        @current-change="pageChange"
        @size-change="pageSizeChange"
      >
      </el-pagination>
    </div>
  </div>

  <tableColumnsPopover
    ref="viewPopover"
    :virtual-ref="viewButton"
    :checked-options="checkedOptions"
    @update:checked-options="checkedOptionsChange"
    :columns="columns"
  />

  <addForm
    v-model:add-data-dialog="addDataDialog"
    ref="addFormRef"
    v-model:checked-options="checkedOptions"
    @add-data="addData"
  />
</template>

<script setup lang="ts">
import { computed, ref, provide, unref, watch } from 'vue'
import colTableColumn from './colTableColumn.vue'
import type { ColumnType } from './type.ts'
import { tableProps } from './type.ts'
import tableColumnsPopover from './components/tableColumnsPopover.vue'
import type { ElTable } from 'element-plus'
import addForm from './components/addForm.vue'

const props = defineProps(tableProps)
const emit = defineEmits([
  'update:searchParams',
  'update:checkedOptions',
  'refresh',
  'delete-rows',
  'add-data',
  'row-click',
  'update:curRow',
])

const tableRef = ref<InstanceType<typeof ElTable>>()

const addDataDialog = ref(false)
const addFormRef = ref<InstanceType<typeof addForm>>()

const default_tableConnfig = {
  height: '100%',
  maxHeight: '100%',
  size: 'default',
  pageSizes: [10, 20, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper',
  background: true,
  status: 0,
  rowKey: 'id',
  showIndex: true,
  indexLabel: 'No.',
  showPagination: true,
  highlightCurrentRow: true,
}

const computedOptions = computed(() => {
  const res = {
    ...default_tableConnfig,
    ...props.options,
  }
  return res
})

/**
 * @description: 计算表格宽度
 * @param arr 列配置
 * @param width 初始宽度
 * @return number 表格宽度
 */
const tableWidth = ref(0)
const getColumnWidth = (arr: ColumnType[], width: number = 0) => {
  arr.forEach((item) => {
    if (item.minWidth) {
      width += item.minWidth
    } else if (item.children && item.children.length > 0 && !item.minWidth) {
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
// const getTableWidth = () => {
//   const width = getColumnWidth(props.columns) + 250
//   tableWidth.value = width > window.innerWidth ? window.innerWidth : width
// }
// getTableWidth()

const currentPage = ref(1)
const pageChange = (page: number) => {
  emit('update:searchParams', {
    ...props.searchParams,
    page,
  })
}
const pageSizeChange = (size: number) => {
  emit('update:searchParams', {
    ...props.searchParams,
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
const popoverOutside = () => {
  unref(viewPopover).popperRef?.delayHide?.()
}

const checkedOptionsChange = (val: ColumnType[]) => {
  emit('update:checkedOptions', val)
}

const deleteRows = () => {
  if (!tableRef.value) return
  const selectedRows = tableRef.value.getSelectionRows()
  if (selectedRows.length === 0) return
  emit('delete-rows', selectedRows)
}

const refresh = () => {
  pageChange(props.searchParams.page)
  emit('refresh')
}

const addData = (addData: any) => {
  // data.value.push(addData)
  emit('add-data', addData)
}

const onRowClick = (row: any, column: any) => {
  emit('row-click', row, column)
  emit('update:curRow', row)
}

</script>

<style lang="scss" scoped>
@use './colTable.scss';
</style>
