<!--
  @description:  
  @author: Wnnk
-->

<template>
  <div>
    <el-select style="width: 240px" v-model="selectValue">
      <!-- 头部插槽 -->
      <template #header>
        <slot name="header">
          <div class="header">
            <el-button @click="useDialog">添加</el-button>
          </div>
        </slot>
      </template>
      
      <!-- 默认选项插槽 -->
      <slot name="options" :options="data">
        <el-option 
          v-for="item in data" 
          :key="item.value" 
          :label="item.label" 
          :value="item.value"
        />
      </slot>
      <!-- empty 插槽 -->
      <template #empty>
        <div class="error" v-if="state === 3">
          加载失败
        </div>
        <div class="empty" v-else>暂无数据</div>
      </template>
      
      <!-- 底部插槽 -->
      <template #footer v-if="state === 1">
        <slot name="footer">
          <div class="footer" >
            loading...
          </div>
        </slot>
      </template>
    </el-select>
  </div>
</template>


<script setup lang='ts'>
import { ref } from 'vue'
import type { PropType } from 'vue';
import { renderDialog } from '@/utils/dialog';
import addForm from './addForm.vue';
import { ElMessageBox } from 'element-plus';

interface City {
  value: string;
  label: string;
}
const props = defineProps({
  data: {
    type: Array as PropType<City[]>,
    required: true,
  }
});
const { data } = props;
const selectValue  = defineModel()


/** 
 * @description: 动态表单弹窗 
**/
const useDialog = async () => {
  const formCache =  sessionStorage.getItem('formCache');
  if (formCache) {
    const confirm = await ElMessageBox.confirm('是否使用上次填写的数据？')
    if (confirm) {
      const form = JSON.parse(formCache);
      renderDialog(addForm, { form }, {});
    } else {
      renderDialog(addForm, {}, {});
    }
    return;
  } 
  renderDialog(addForm, {}, {});
}

// 0：未加载 ，1：加载中，2:加载完成 3：加载失败
const state = ref(3);



</script>

<style lang='scss' scoped>
.header {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>