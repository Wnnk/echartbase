<template>
<div class="realtime-echart">
</div>

</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'
// import { openSSE } from '@/api/realtimeEchart'
import Echart from '@/hooks/useEchart'
import type { ECOption } from '@/hooks/useEchart'
import { v4 as uuidv4 } from 'uuid';
import { isArray } from 'element-plus/es/utils/types.mjs';

const option:ECOption = {
  title: {
    text: '实时数据图表',
    left: 'left'
  },
  tooltip: {},
  legend: {},
  xAxis: {
    type: 'time',
    name: 'time'
  },
  yAxis: {
    type: 'value',
    name: 'price'
  },
  series:[
    {
      type: 'line',
    }
  ],
  dataset:{
    source:[]
  }
}

let chart: Echart | null = null;
let eventSource: EventSource | null = null;
let isConnected = false;
const maxLen = 100;

const openSSE = async (url: string) => {
  let heartbeatTime:Date | null = null;
  let heartbeatId:number | undefined = undefined;

  if(eventSource) {
    console.log('eventSource is already open');
    return;
  }
  eventSource = new EventSource(url);
  isConnected = true;

  eventSource.onopen = (event) => {
    isConnected = true;
    heartbeatId =  setInterval(() => {
      const now = new Date();
      if(heartbeatTime && (now.getTime() - heartbeatTime.getTime()) > 15000) {
        console.log('heartbeat timeout, reconnecting...');
        eventSource?.close();
        eventSource = null;
        isConnected = false;
        clearInterval(heartbeatId);
        openSSE(url);
      }
    }, 15000)
    console.log(event)
  }

  eventSource.onmessage = (event) => {
    const res = JSON.parse(event.data);
    if(res.event === 'heartbeat') {
      heartbeatTime = res.time;
    } else {
      updateOption(res.data);
    }


  }



  eventSource.onerror = (event) => {
    console.log('EventSource error', event);
    eventSource?.close();
    eventSource = null;
    isConnected = false;
  }
}

const closeSSE = () => {
  if(eventSource) {
    eventSource.close();
    eventSource = null;
    isConnected = false;
    console.log('eventSource closed');
  }
}
type DataTye = {
  time: number,
  price: number
}

const updateOption = (data: DataTye) => {
  if(!option.dataset)return;
  if(!(Array.isArray(option.dataset.source))) return;
  if(option.dataset.source.length >= maxLen) {
    option.dataset.source.shift();
  }
  option.dataset.source.push(data);
  chart?.updateChart(option);
}




onMounted(async () => {
  const dom = document.querySelector('.realtime-echart') as HTMLDivElement
  chart = new Echart(dom, option)
  await openSSE('http://localhost:3000/api/events')
})
</script>

<style lang='scss' scoped>
.realtime-echart {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>