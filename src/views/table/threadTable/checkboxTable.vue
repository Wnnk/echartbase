<!-- 
  @description: 根据表头checkbox生成表格列
-->

<template>
  <div class="custom-table">
    <!-- 表头控制行（独占一行） -->
    <div class="table-header-control">
     <el-checkbox 
        v-model="selectAll" 
        :indeterminate="isIndeterminate"
        @change="handleSelectAll"
      >全选</el-checkbox>
      <el-checkbox-group v-model="checkedList" @change="handleCheckedChange">
        <el-checkbox 
          v-for="item in checkboxOptions" 
          :key="item.prop" 
          :value="item"
        >
          {{ item.label }}
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <!-- 正常表格 -->
    <el-table 
      :data="data" 
      ref="tableRef"
      border 
      style="width: 100%"
      :header-cell-style="{ textAlign: 'center' }"
      row-key="id"
    >
      <el-table-column 
        v-for="item in checkedList" 
        :key="item.prop" 
        :prop="item.prop" 
        :label="item.label"
        align="center"
      />
    </el-table>
  </div>
  <el-button @click="download">download</el-button>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import * as XLSX from 'xlsx'

const tableRef = ref();

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  checkgroup: {
    type: Array,
    required: true
  }
})

// 获取checkbox选项
const checkboxOptions = computed(() => {
  const group = props.checkgroup.find(item => item.path === '/user')
  return group?.list || []
})

// 选中的列（默认全选）
const checkedList = ref([]);
// 全选状态
const selectAll = ref(false)
// 半选状态（部分选中）
const isIndeterminate = ref(false)

// 更新全选状态
const updateSelectAllState = () => {
  const checkedCount = checkedList.value.length
  selectAll.value = checkedCount === checkboxOptions.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < checkboxOptions.value.length
}

// 全选/反选处理
const handleSelectAll = (val) => {
  checkedList.value = val ? [...checkboxOptions.value] : []
  isIndeterminate.value = false
}

// 单个选项变化处理
const handleCheckedChange = () => {
  updateSelectAllState()
}


const download = () => {
  const book = XLSX.utils.book_new()
  const sheet = XLSX.utils.table_to_sheet(tableRef.value.$el);
  XLSX.utils.book_append_sheet(book, sheet, 'Sheet1');
  XLSX.writeFile(book, 'table.xlsx');
}

// 当选项变化时重新初始化
watch(checkboxOptions, (newVal) => {
  checkedList.value = [...newVal]
})
</script>

<style scoped>
.custom-table {
  width: 100%;
}

/* 表头控制行样式 */
.table-header-control {
  background: #f5f7fa;
  padding: 12px;
  margin-bottom: -1px; 
  border: 1px solid #dfe6ec;
  border-bottom: none;
  text-align: center;
}

.table-header-control .el-checkbox-group {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}
.table-header-allcheck{
  margin-right: 30px;
}

/* 保持表格外观不变 */
:deep(.el-table) {
  margin-top: 0;
}
</style>