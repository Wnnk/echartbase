<template>
  <div class="echart-contianer">11</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Echart from '@/hooks/useEchart'
import type { ECOption } from '@/hooks/useEchart'
import { getBigData, testData } from '@/api/bigDataEchart'
import type { DatasetOption } from 'echarts/types/dist/shared'

let option: ECOption = {
  title: {
    text: '大数据量折线图',
  },
  xAxis: {
    type: 'time',
  },
  yAxis: {
    type: 'value',
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 10,
    },
    {
      start: 0,
      end: 10,
    },
  ],
  series: [
    {
      type: 'line',
      symbol: 'none',
      sampling: 'lttb',
      itemStyle: {
        color: 'rgb(255, 70, 131)',
      },
    },
  ],
  dataset: [
    {
      source: [],
    },
  ],
}

onMounted(async () => {
  const dom = document.querySelector('.echart-contianer') as HTMLDivElement
  const chart = new Echart(dom, option)
  // const data = await getBigData()
  let start = 0
  for (start; start < 100000; start += 5000) {
    try {
      const data = await testData(start, start + 5000)
      option.dataset[0].source.push(...data)
      chart.updateChart(option)
    } catch (error) {
      console.log(error)
    }
  }
  // option.dataset[0].source = data
  chart.updateChart(option)
})
</script>

<style lang="scss" scoped>
.echart-contianer {
  width: 100%;
  height: 100%;
}
</style>
