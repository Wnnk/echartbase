<template>
  <div class="container">
    <h1>换行</h1>
    <div class="long-title-echart"></div>
    <h1>省略... hover展示</h1>
    <div class="long-title-echart2"></div>
    <div id="custom-tooltip"></div>
    <h1>自适应font</h1>
    <div class="long-title-echart3"></div>
    <h1>x轴y轴文字过长:竖直排列</h1>
    <div class="long-title-echart4"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Echart from '@/hooks/useEchart'
import type { ECOption } from '@/hooks/useEchart'
const option4: ECOption = {
  title: {
    text: 'x轴或y轴过长',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985',
      },
    },
  },
  legend: {
    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'],
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: [
        'Mon11111111111',
        'Tue22222222222222222',
        'Wed3333333333333',
        'Thu4444444444',
        'Fri5555555555',
        'Sat6666666666',
        'Sun77777777777',
      ],
    },
  ],
  yAxis: [
    {
      type: 'value',
    },
  ],
  series: [
    {
      name: 'Email',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series',
      },
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: 'Union Ads',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series',
      },
      data: [220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: 'Video Ads',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series',
      },
      data: [150, 232, 201, 154, 190, 330, 410],
    },
    {
      name: 'Direct',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series',
      },
      data: [320, 332, 301, 334, 390, 330, 320],
    },
    {
      name: 'Search Engine',
      type: 'line',
      stack: 'Total',
      label: {
        show: true,
        position: 'top',
      },
      areaStyle: {},
      emphasis: {
        focus: 'series',
      },
      data: [820, 932, 901, 934, 1290, 1330, 1320],
    },
  ],
}

const createTitleOption = (title: any) => {
  const option: ECOption = {
    title,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'],
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: 'Union Ads',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: 'Video Ads',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: 'Direct',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: 'Search Engine',
        type: 'line',
        stack: 'Total',
        label: {
          show: true,
          position: 'top',
        },
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
  }
  return option
}

onMounted(() => {
  const longTitle = `这是一个长的纯中文标题1，这是一个长的纯中文标题2，这是一个长的纯中文标题3，这是一个长的纯中文标题4，这是一个长的纯中文标题5，这是一个长的纯中文标题6，`
  const tooltip = document.getElementById('custom-tooltip') as HTMLDivElement
  const dom = document.querySelector('.long-title-echart') as HTMLDivElement
  const option = createTitleOption({
    text: longTitle,
    top: 20,
    left: 'center',
    textStyle: {
      width: 500 * 0.8,
      overflow: 'breakAll',
    },
  })
  const chart1 = new Echart(dom, option)
  const dom2 = document.querySelector('.long-title-echart2') as HTMLDivElement
  const option2 = createTitleOption({
    text: longTitle,
    top: 20,
    left: 'center',
    textStyle: {
      width: 500 * 0.8,
      overflow: 'truncate',
    },
  })
  option2.graphic = [
    {
      type: 'rect',
      left: 'center',
      top: 40, // 调整位置与 title 对齐
      shape: {
        width: 500 * 0.8, // 宽度与标题大致匹配
        height: 40,
      },
      style: {
        fill: 'transparent',
      },
      onmouseover: () => {
        tooltip.style.display = 'block'
        tooltip.innerHTML = longTitle
        chart2.chart!.getZr().on('mousemove', (e) => {
          let chartRect = chart2.chart!.getDom().getBoundingClientRect()
          console.log(chartRect)
          tooltip.style.position = 'absolute'
          tooltip.style.left = chartRect.left + e.offsetX + 10 + 'px'
          tooltip.style.top = chartRect.top + e.offsetY + 10 + 'px'
        })
      },
      onmouseout: () => {
        tooltip.style.display = 'none'
        chart2.chart!.getZr().off('mousemove') // 移除鼠标移动监听
      },
    },
  ]

  const chart2 = new Echart(dom2, option2)

  const measureTextWidth = (text: string, fontSize: number, fontFamily: string) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.font = `${fontSize}px ${fontFamily}`
    return ctx.measureText(text).width
  }
  const calculateFontSizePrecise = (
    str: string,
    boxWidth: number,
    min: number = 1,
    max: number = 100,
  ) => {
    let low = min,
      high = max,
      best = min
    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      const width = measureTextWidth(str, mid, 'Arial')
      if (!width) return 0
      if (width <= boxWidth) {
        best = mid
        low = mid + 1
      } else {
        high = mid - 1
      }
    }
    return best
  }

  const option3 = createTitleOption({
    text: longTitle,
    top: 20,
    left: 'center',
    textStyle: {
      width: 800 * 0.8,
      fontSize: calculateFontSizePrecise(longTitle, 800 * 0.8),
    },
  })
  const dom3 = document.querySelector('.long-title-echart3') as HTMLDivElement
  const chart3 = new Echart(dom3, option3)

  const dom4 = document.querySelector('.long-title-echart4') as HTMLDivElement

  const chart4 = new Echart(dom4, option4)
})
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  width: 100%;
  // height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
}
.long-title-echart {
  width: 500px;
  height: 500px;
}
.long-title-echart2 {
  width: 500px;
  height: 500px;
  position: relative;
}
.long-title-echart3 {
  width: 800px;
  height: 500px;
}
.long-title-echart4 {
  width: 500px;
  height: 500px;
}

.custom-tooltip {
}
</style>
