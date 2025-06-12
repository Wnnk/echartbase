<template>
  <el-popover trigger="click" virtual-triggering v-model:visible="visiable" placement="bottom-start" width="300">
    <div class="columns-contents">
      <div class="title">选择需要展示的列</div>
      <div class="label">已选</div>
      <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="checkedAllChange">
        全选
      </el-checkbox>
      <el-divider />
      <el-tree
        :data="localColumns"
        show-checkbox
        node-key="prop"
        ref="treeRef"
        @check="handleTreeCheck"
      >
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
  },
})

const localCheckedOptions = ref<ColumnType[]>([])
const localColumns = ref<ColumnType[]>(_.cloneDeep(props.columns))

const initCheckedOptions = () => {
  try {
    localColumns.value = props.columns
    localCheckedOptions.value = props.checkedOptions || []
      nextTick(() => {
        const keys =  getAllKeys(localCheckedOptions.value)
        treeRef.value?.setCheckedKeys(keys,false)
      }) 
  } catch (error) {
    console.error('Error initializing checked options:', error)
    // 回退到全选
    const allKeys = getAllKeys(props.columns)
    localCheckedOptions.value = _.cloneDeep(props.columns)
    nextTick(() => {
      treeRef.value?.setCheckedKeys(allKeys,false)
    })
  }
}


// 递归获取所有节点的 prop（用于全选）
const getAllKeys = (nodes: ColumnType[]): string[] => {
  // return nodes.flatMap((node) => [node.prop, ...(node.children ? getAllKeys(node.children) : [])])
  const keys: string[] = []
  nodes.forEach((node) => {
    if(node.children) {
      keys.push(...getAllKeys(node.children))
    }else {
      keys.push(node.prop)
    }
  })
  return keys
}


watch(
  () => [props.columns, props.checkedOptions],
  () => {
    initCheckedOptions()
  },
  {
    immediate: true,
  }
)


const checkAll = ref(true)
const indeterminate = ref(false)
const visiable = ref(false)
const treeRef = ref<InstanceType<typeof ElTree>>()
const checkedAllChange = (val: boolean) => {
  if (val) {
    const keys = localColumns.value.map((item) => item.prop)
    treeRef.value?.setCheckedKeys(keys)
  } else {
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
  if (!treeRef.value) return

  // 1. 获取选中的节点
  const checkedKeys = treeRef.value.getCheckedKeys() as string[]
  const newCheckedOptions = filterChecked(props.columns, checkedKeys)
 
  // 3. 提交过滤后的数据（仅最顶层选中节点）
  emit("update:checkedOptions", newCheckedOptions);
  // 4. 存储选中状态到 localStorage
  localStorage.setItem('checkedOptions', JSON.stringify(newCheckedOptions))
}


const filterChecked = (columns: ColumnType[], checkedKeys: string[]): ColumnType[] => {
  const result: ColumnType[] = []
  columns.forEach((column) => {
    if (column.children) {
      const child = filterChecked(column.children, checkedKeys)
      if (child.length > 0 ) {
        result.push({
          ...column,
          children: child.length ? child : undefined,
        })
      }
    }
    else if (checkedKeys.includes(column.prop)) {
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
