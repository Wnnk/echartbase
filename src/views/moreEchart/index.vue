<template>
  <div class="echart-container">
    <div
      v-for="(iten, index) in echartList"
      :key="index"
      :id="`chart${index}`"
      class="echart"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Echart from '@/hooks/useEchart'
import { getMoreData } from '@/api/moreDataEchart'
import { en } from 'element-plus/es/locale/index.mjs'
const echartList = ref(new Array(50).fill(0))

const loadMore = async (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
  entries.forEach(async (entry) => {
    if (entry.intersectionRatio > 0) {
      observer.unobserve(entry.target)
      const option = await getMoreData()
      const chart = new Echart(entry.target as HTMLDivElement, option)
    }
  })
}

onMounted(() => {
  const observer = new IntersectionObserver(loadMore, {
    root: null,
    rootMargin: '0px',
    threshold: 0.2,
  })
  echartList.value.forEach((item, index) => {
    const dom = document.getElementById(`chart${index}`) as HTMLDivElement
    if (!dom) return
    observer.observe(dom)
  })
})

// onMounted(async () => {

//   for (let i = 0; i < echartList.value.length; i++) {
//     const dom = document.getElementById(`chart${i}`) as HTMLDivElement
//     if (!dom) return
//     const option = await getMoreData()
//     const chart = new Echart(dom, option)
//   }
// })
</script>

<style lang="scss" scoped>
.echart-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
.echart {
  width: 100%;
  height: 600px;
  border: 1px solid #ccc;
}
</style>
