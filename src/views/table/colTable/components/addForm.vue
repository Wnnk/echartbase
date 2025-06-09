<template>
  <el-dialog v-model="addFormVisible">
    <el-form v-model="form" >
      <div class="title">添加数据</div>
      <el-form-item v-for="(item ,index) in formConfig" :label="item.label" :prop="item.prop">
        <el-input v-model="form[item.prop]" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveAndAdd">添加</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

</template>

<script setup lang='ts'>
import { ref, onMounted,watch } from 'vue'
import type { ColumnType } from '@/views/table/colTable/type'
import type { PropType } from 'vue'
import _ from 'lodash'
const {  checkedOptions } = defineProps({
  checkedOptions: {
    type: Array as PropType<ColumnType[]>,
    default: [],
    required: true
  }
})
const emit = defineEmits(['addData'])
const addFormVisible = defineModel("add-data-dialog");
const form = ref<any>({})
const formConfig = ref<any[]>([])

const initForm= (columns: ColumnType[]) => {
  const resultForm: any = {};
  columns.forEach(column => {
    if (column.children) {
      resultForm[column.prop] = {
        ...initForm(column.children)
      }
    }else {
      resultForm[column.prop] = ""
    }
  })
  return resultForm
}
const initConfig = (columns: ColumnType[]): any[] => {
  const result: any[] = [];
  
  columns.forEach(column => {
    if (column.children) {
      // 递归处理子项
      result.push(...initConfig(column.children));
    } else {
      // 只添加叶子节点作为表单项
      result.push({
        ...column,
        // 如果有父级prop，则组合成 'parent.child' 的形式
        prop: column.prop
      });
    }
  });
  
  return result;
};
form.value = initForm(checkedOptions);
formConfig.value = initConfig(checkedOptions);

watch(
  () => checkedOptions,
  () => {
    form.value = initForm(checkedOptions);
    formConfig.value = initConfig(checkedOptions);
  }
)


const saveAndAdd = () => {
  emit('addData', form.value)
  addFormVisible.value = false
}




</script>

<style lang='scss' scoped>
.title {
  font-size: 18px;
  border-radius: 8px;
  background-color: #f5f5f5;
  padding: 10px;
  margin: 10px 0;
}
</style>