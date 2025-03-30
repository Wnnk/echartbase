<template>
  <div class="water-mark-echart"></div>
  <el-button @click="downloadChart">下载图表</el-button>
  <el-button @click="createWatermark('背景水印')">添加背景水印</el-button>
  <el-button @click="clearWatermark">清除背景水印</el-button>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Echart from '@/hooks/useEchart'
import type { ECOption } from '@/hooks/useEchart'

function createWatermark(text: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 300
  canvas.height = 200
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.rotate((-20 * Math.PI) / 180)
  ctx.fillStyle = 'rgba(200, 200, 200, 0.2)'
  ctx.font = '16px Arial'
  ctx.fillText(text, 40, 100)
  canvas.classList.add('watermark')
  document.body.style.backgroundImage = `url(${canvas.toDataURL()})`
}

const clearWatermark = () => {
  document.body.style.backgroundImage = ''
  const existingCanvas = document.querySelector('canvas.watermark')
  if (existingCanvas) existingCanvas.remove()
  console.log(document.body.style.backgroundImage)
}

const option: ECOption = {
  legend: {
    data: ['Altitude (km) vs Temperature (°C)'],
  },
  tooltip: {
    trigger: 'axis',
    formatter: 'Temperature : <br/>{b}km : {c}°C',
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} °C',
    },
  },
  yAxis: {
    type: 'category',
    axisLine: { onZero: false },
    axisLabel: {
      formatter: '{value} km',
    },
    boundaryGap: true,
    data: ['0', '10', '20', '30', '40', '50', '60', '70', '80'],
  },

  series: [
    {
      name: '高度(km)与气温(°C)变化关系',
      type: 'line',
      smooth: true,
      data: [15, -50, -56.5, -46.5, -22.1, -2.5, -27.7, -55.7, -76.5],
    },
  ],
}

const echart = ref<Echart | null>(null)
const downloadChart = async () => {
  if (!echart.value) return

  // 获取原始图表图片
  const originalImg = await echart.value.chart!.getConnectedDataURL({
    type: 'png',
    pixelRatio: 2,
    backgroundColor: '#fff',
    excludeComponents: ['toolbox'],
  })

  // 创建临时canvas
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 加载原始图片
  const img = new Image()
  img.src = originalImg

  await new Promise((resolve) => {
    img.onload = resolve
  })

  canvas.width = img.width
  canvas.height = img.height
  ctx.drawImage(img, 0, 0)

  // 水印设置
  ctx.font = '24px Arial'
  ctx.fillStyle = 'rgba(180, 180, 180, 0.3)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const watermarkText = '水印文字，如有侵权请联系删除'
  const watermarkWidth = 200 // 水印间距
  const watermarkHeight = 150

  // 平铺水印
  ctx.save()
  ctx.globalAlpha = 0.3

  for (let i = 0; i < canvas.width; i += watermarkWidth) {
    for (let j = 0; j < canvas.height; j += watermarkHeight) {
      ctx.save()
      ctx.translate(i, j)
      ctx.rotate((-30 * Math.PI) / 180) // 旋转30度
      ctx.fillText(watermarkText, 0, 0)
      ctx.restore()
    }
  }

  ctx.restore()

  // 导出并下载
  const watermarkedImg = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.href = watermarkedImg
  link.download = 'water-mark-echart.png'
  link.click()
}
onMounted(() => {
  const dom = document.querySelector('.water-mark-echart') as HTMLDivElement
  echart.value = new Echart(dom, option)
})
</script>

<style lang="scss" scoped>
.water-mark-echart {
  height: 100%;
  width: 100%;
}
</style>
