<template>
  <div class="form-container">
    <Select 
      v-model="selectValue" 
      :style="{width: '240px'}"
      placeholder="Select an option"
      url="/getSelectData"
      filterable
    >
      <template v-slot="row">
        {{ row }}
      </template>
      <template v-slot:emptyData>
        请求数据为空
      </template>
    </Select>
    <el-button @click="onclick"> 打开弹窗</el-button>
  </div>
  




 

</template>

<script setup lang='ts'>
import { onMounted, ref,watch } from 'vue'
import Select from '@/components/select/index.vue'
import { renderDialog } from '@/utils/dialog';
import Test from './test.vue';

const selectValue = ref('id');
const formInline = ref({
  regionName: '区域一',
  region: {"label": "区域一", "id": "shanghai"}
})
type OptionItem = {
  label: string;
  id: string;
}
const options = ref<OptionItem[]>([]);

onMounted(() => {
  setTimeout(() => {
    options.value = [{
      label: '区域一',
      id:'shanghai'
    }, {
      label: '区域二',
      id: 'beijing'
    }]
  },1000)
})

const onclick = async () => {
  renderDialog(
    Test,
    {
  
    },
    {
      title: '弹窗标题',
      center: true,
    }
  )
}
</script>

<style lang='scss' scoped>
.form-container {
  width: 100%;
  height: 100%;
  display: flex;
  place-items: center;
  justify-content: center;
}


</style>