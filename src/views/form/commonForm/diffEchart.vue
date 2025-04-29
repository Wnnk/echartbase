<template>
<div class="diff-echart" :style="{ width: '100%', height: '100%', minHeight: '300px' }">

</div>

</template>

<script setup lang='ts'>
import { ref, computed, onMounted } from 'vue'
import Echart from '@/hooks/useEchart'
import axios from 'axios';
const chart = ref<Echart | null>(null);
const { diff } = defineProps({
  diff: {
    type: Array,
    required: true
  }
})
console.log(diff)
const diffToOption = (diff: Array<any>) => {
  const xAxisData = diff.map(item => item.key)
  const seriesData = diff.map(item =>{
    return [item.oldValue, item.newValue]
  })
  console.log(xAxisData, seriesData)
}
diffToOption(diff)
const option = ref({
  title: {
    text: '差异图'
  },
  xAxis: {
    type: 'category',
    data: diff.map(item => item.key)
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
    name:'oldValue',
    type: 'bar',
    data: diff.map(item => item.oldValue)
    },
    {
      name:'newValue',
      type: 'bar',
      data: diff.map(item => item.newValue)
    }
  ]

})

onMounted(() => {
  const dom  = document.querySelector('.diff-echart') as HTMLDivElement;
  chart.value = new Echart(dom, option.value);
});


</script>

<style lang='scss' scoped>

</style>