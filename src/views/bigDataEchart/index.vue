<template>
  <div class="container">
    <el-header>标题</el-header>
    <el-main>
      <el-skeleton style="width: 100%; height: 100%" v-show="loading">
        <template #template>
          <el-skeleton-item variant="rect" style="width: 100%; height: 100%"> </el-skeleton-item>
        </template>
      </el-skeleton>
      <div class="echart-contianer" v-show="!loading"></div>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import Echart from '@/hooks/useEchart'
import type { ECOption } from '@/hooks/useEchart'
import { getBigData, testData } from '@/api/bigDataEchart'

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
const loading = ref(false)

onMounted(async () => {
  const data = await getBigData()

  /* web worker */
  // const worker = new Worker(new URL('./worker.ts', import.meta.url), {
  //   type: 'module',
  // })
  // worker.postMessage({
  //   type: 'init',
  //   option,
  //   resData: data,
  // })
  // worker.onmessage = (event) => {
  //   console.log(event.data)
  //   option = event.data.option
  //   const dom = document.querySelector('.echart-contianer') as HTMLDivElement
  //   const chart = new Echart(dom, option)
  //   chart.updateChart(option)

  //   worker.terminate()
  // }
  // worker.onmessageerror = (event) => {
  //   console.error(event)
  // }

  /* 分段请求，分段加载 */
  const dom = document.querySelector('.echart-contianer') as HTMLDivElement
  const chart = new Echart(dom, option)

  let start = 0
  for (start; start < 100000; start += 5000) {
    try {
      const data = await testData(start, start + 5000)
      option.dataset[0].source.push(...data)
      chart.updateChart(option)
    } catch (error) {}
  }

  // loading.value = false
})
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  .el-header {
    height: 60px;
    background-color: #fff;
    line-height: 60px;
    text-align: center;
    font-size: 20px;
    color: #303133;
    border-bottom: 1px solid #eee;
  }
  .el-main {
    height: calc(100% - 60px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
.echart-contianer {
  width: 100%;
  height: 100%;
}
</style>
