self.onmessage = (e) => {
  const { resData, type, option } = e.data
  switch (type) {
    case 'init':
      InitHandlerOption(resData, option)
      break
    default:
      break
  }
}

const InitHandlerOption = (data: any, option: any) => {
  option.datazoom = [
    {
      type: 'inside',
      start: 0,
      end: 10,
    },
    {
      start: 0,
      end: 10,
    },
  ]
  option.xAxis = {
    type: 'time',
    splitLine: {
      show: false,
    },
    data: data.map((item: any) => item.time),
  }
  option.yAxis = {
    boundaryGap: [0, '10%'],
    splitLine: {
      show: true,
    },
  }
  option.series = [
    {
      type: 'line',
      showSymbol: false,
      name: 'value',
      data: data.map((item: any) => item.value),
      encode: {
        x: 'time',
        y: 'value',
      },
      animation: false, // 关闭动画提升性能
      large: true, // 启用大数据量优化模式
      progressiveChunkMode: 'mod', // 分块模式
    },
  ]

  self.postMessage({ option })
}
