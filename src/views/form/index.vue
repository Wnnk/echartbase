<template>
  <div class="form-container">
    <!-- <Select 
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
    <el-button @click="onclick"> 打开弹窗</el-button> -->
    <Select :data="cities" v-model="selectValue">
      <template #options="{ options }">
        <el-option
          v-for="item in cities"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <span style="float: left">{{ item.label }}</span>
          <span
            style="
              float: right;
              color: var(--el-text-color-secondary);
              font-size: 13px;
            "
          >
          {{ item.value }}
        </span>
        </el-option>

    </template>
    </Select>
    <span>{{ selectValue }}</span>
    <el-button v-permission="'user'" >权限测试1</el-button>
    <el-button v-permission="'admin'" >权限测试2</el-button>
    <el-button v-permission="'boss'" >权限测试3</el-button>
    <datePcker></datePcker>
  </div>
</template>

<script setup lang='ts'>
import { onMounted, ref,watch } from 'vue'
import SelectV2 from '@/components/selectV2/index.vue'
import Select from '@/components/select/index.vue'
import datePcker from '@/components/datePicker/index.vue'
import { renderDialog } from '@/utils/dialog';
import Test from './test.vue';

/* select */
const cities = ref([
  {
    value: 'Beijing',
    label: '北京',
  },
  {
    label: '上海',
    value: 'Shanghai',
  },
  {
    value: 'Nanjing',
    label: '南京',
  },
  {
    value: 'Chengdu',
    label: '成都',
  },
  {
    label: '深圳',  
    value: 'Shenzhen',
  },
  {
    label: '广州',
    value: 'Guangzhou',
  },
]);
const selectValue = ref('');
watch(
  () => selectValue.value,
  (newValue) => {
    console.log(newValue)
  }
)



localStorage.setItem('permission', 'boss');
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