<template>
  <el-popover trigger="click" virtual-triggering>
    <div class="columns-contents">
      <div class="title">选择需要展示的列</div>
      <div class="label">已选</div>
      <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="checkedAllChange">
        全选
      </el-checkbox>
      <el-divider />
        <el-tree :data="localColumns" show-checkbox node-key="prop"  ref="treeRef" @check="handleTreeCheck">
        </el-tree>
      <el-divider />
      <div class="popover-footer">
        <el-button type="primary" @click="submit">保存</el-button>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { ColumnType } from '../type'
import type { PropType } from 'vue'
import { ElTree } from 'element-plus'
import _ from 'lodash'


const emit = defineEmits(['update:checkedOptions'])
const props = defineProps({
  checkedOptions: {
    type: Array as PropType<ColumnType[]>,
    default: () => [],
    required: true,
  },
  columns: {
    type: Array as PropType<ColumnType[]>,
    default: () => [],
    required: true,
  }
})


const localCheckedOptions = ref<ColumnType[]>([])
const localColumns = ref<ColumnType[]>(_.cloneDeep(props.columns));
// 初始化数据（从 localStorage 读取或使用默认全选）
const initCheckedOptions = (columns: ColumnType[]) => {
  const savedData = localStorage.getItem('checkedOptions');
  
  if (savedData) {
    // 如果有存储的数据，使用存储的选中状态
    localCheckedOptions.value = JSON.parse(savedData);
  } else {
    // 否则默认全选所有节点
    localCheckedOptions.value = _.cloneDeep(columns);
    const allKeys = getAllKeys(columns); // 获取所有节点的 prop
    nextTick(() => {
      treeRef.value?.setCheckedKeys(allKeys); // 设置全选
    });
  }
};

// 递归获取所有节点的 prop（用于全选）
const getAllKeys = (nodes: ColumnType[]): string[] => {
  return nodes.flatMap(node => [
    node.prop,
    ...(node.children ? getAllKeys(node.children) : [])
  ]);
};

initCheckedOptions(props.columns);

watch(
  () => props.checkedOptions,
  (val) => {
    initCheckedOptions(val)
  },
  { deep: true }
)

const checkAll = ref(true)
const indeterminate = ref(false)
const treeRef = ref<InstanceType<typeof ElTree>>()
const checkedAllChange =(val:boolean) => {
  if(val) {
    const keys = localCheckedOptions.value.map(item => item.prop)
    treeRef.value?.setCheckedKeys(keys)
 
  }else {
    treeRef.value?.setCheckedKeys([])
  }
}


const handleTreeCheck = () => {
  const allKeys = getAllKeys(localColumns.value)
  const ckeckedCount = treeRef.value?.getCheckedKeys().length || 0

  /* 全选 */
  checkAll.value = ckeckedCount === allKeys.length
  /* 半选 */
  indeterminate.value = ckeckedCount > 0 && ckeckedCount < allKeys.length
}





const submit = () => {
  if (!treeRef.value) return;

  // 1. 获取选中的节点
  const checkedKeys = treeRef.value.getCheckedKeys() as string[]
  const newCheckedOptions = filterChecked(props.columns, checkedKeys)
  console.log(newCheckedOptions)

  // 3. 提交过滤后的数据（仅最顶层选中节点）
  emit("update:checkedOptions", newCheckedOptions);
};

const filterChecked = (columns:ColumnType[], checkedKeys:string[]): ColumnType[] => {
  const result: ColumnType[] = []
  columns.forEach(column => {
    if (column.children) {
      const children = filterChecked(column.children, checkedKeys)
      result.push({
        ...column,
        children : children.length ? children : undefined,
      })
    }
    if(checkedKeys.includes(column.prop)) {
      result.push(column)
    }
  })
  return result
}
</script>

<style lang="scss" scoped>
.popover-footer {
  display: flex;
}
</style>
