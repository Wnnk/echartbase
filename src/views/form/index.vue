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



    <!-- <el-form :model="formInline" class="demo-form-inline">
      {{formInline}}
      <el-form-item label="活动区域">
        <el-select v-model="formInline.region" placeholder="请选择活动区域" :style="{width: '340px'}"   
          value-key="id"
          >
          <el-option :label="item.label" :value="item" v-for="item in options"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">
          更新
        </el-button>
      </el-form-item>
    </el-form> -->
  
  </div>
</template>

<script setup lang='ts'>
import { onMounted, ref,watch } from 'vue'
import Select from '@/components/select/index.vue'

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


const onSubmit = () => {
  console.log(formInline.value)
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