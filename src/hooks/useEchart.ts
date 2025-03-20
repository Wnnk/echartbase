import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  // 数据集组件
  DatasetComponent,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent,
  DataZoomComponent,
  ToolboxComponent,
  VisualMapComponent, // 视觉映射组件
  LegendComponent 
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import type {
  // 系列类型的定义后缀都为 SeriesOption
  BarSeriesOption,
  LineSeriesOption,
} from 'echarts/charts'
import type {
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  DatasetComponentOption,
} from 'echarts/components'
import type { ComposeOption } from 'echarts/core'

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
export type ECOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
>

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  DataZoomComponent,
  ToolboxComponent,
  VisualMapComponent,
  LegendComponent 
])

class Echart {
  chart: echarts.ECharts | null = null

  constructor(dom: HTMLDivElement, option: ECOption) {
    this.chart = this.initChart(dom, option)
  }

  initChart = (dom: HTMLDivElement, option: ECOption) => {
    const chart = echarts.init(dom)
    this.echatObsever(chart, dom)
    chart.setOption(option)
    return chart
  }

  echatObsever = (chart: echarts.ECharts, dom: HTMLDivElement) => {
    const observer = new ResizeObserver(() => {
      chart.resize()
    })
    observer.observe(dom)
  }

  updateChart = (option: ECOption) => {
    if (!this.chart) return
    this.chart.setOption(option)
    return
  }

  clearChart = () => {
    if (!this.chart) return
    this.chart.dispose()
  }
}

export default Echart
