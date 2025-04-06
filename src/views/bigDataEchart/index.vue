<template>
  <el-container class="container">
    <el-header>标题</el-header>
    <el-container>
      <el-aside width="200px">
        <el-form>
          <el-form-item>
            <el-button>123</el-button>
          </el-form-item>
          <el-form-item>
            <el-tooltip content="提示内容" placement="top">
              <div slot="content">提示内容</div>
            </el-tooltip>
          </el-form-item>
        </el-form>
      </el-aside>
      <el-main>
        <el-skeleton style="width: 100%; height: 100%" v-show="loading">
          <template #template>
            <el-skeleton-item variant="rect" style="width: 100%; height: 100%"> </el-skeleton-item>
          </template>
        </el-skeleton>
        <div class="echart-contianer" v-show="!loading"></div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Echart from '@/hooks/useEchart'
import type { ECOption } from '@/hooks/useEchart'
import { getBigData, testData } from '@/api/bigDataEchart'

let option: ECOption = {
  title: {
    text: '大数据量折线图',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  xAxis: {
    type: 'time',
    silent: false,
    splitLine: {
      show: false,
    },
    splitArea: {
      show: false,
    },
  },
  yAxis: {
    type: 'value',
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 2,
    },
    {
      start: 0,
      end: 2,
    },
  ],
  series: [
    {
      type: 'line',
      progressive: 1000, // 每次渲染的数据量
      progressiveThreshold: 5000, // 超过此数量启用渐进渲染
    },
  ],
  dataset: [
    {
      source: [],
    },
  ],
}
const chart = ref<Echart | null>(null)
const loading = ref(true)

const createWorker = () => {
  /* 一次请求，webWorker处理，分片渲染 */
  const worker = new Worker(new URL('./worker.ts', import.meta.url), {
    type: 'module',
  })

  try {
    worker.postMessage({
      type: 'init',
    })

    worker.onmessage = (event) => {
      const { chunk, done, type } = event.data
      if (type === 'init') {
        loading.value = false
        const dom = document.querySelector('.echart-contianer') as HTMLDivElement
        chart.value = new Echart(dom, option)
      } else if (type === 'chunk') {
        chart.value?.chart?.appendData({
          seriesIndex: 0,
          data: chunk,
        })
        if (done) {
          worker.terminate()
        }
        chart.value?.chart?.resize()
      }
    }

    worker.onerror = (error) => {
      console.log(error)
    }
  } catch (error) {}
}

createWorker()

onMounted(async () => {
  /* 
    分段请求，分段渲染
    问题点: 1.title，lengdge 显示，但图表空白
  */
  /* 无效操作，配合一次请求的骨架屏 */
  // loading.value = false;
  // const dom = document.querySelector('.echart-contianer') as HTMLDivElement
  // chart.value = new Echart(dom, option)
  // let start = 0
  // for (start; start < 100000; start += 5000) {
  //   try {
  //     const data = await testData(start, start + 5000);
  //     const chunk = data.map((item: any) => {
  //       return [item.time, item.value]
  //     })
  //     chart.value?.chart?.appendData({
  //       seriesIndex: 0,
  //       data: chunk,
  //     })
  //     chart.value?.chart?.resize()
  //   } catch (error) {}
  // }
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
