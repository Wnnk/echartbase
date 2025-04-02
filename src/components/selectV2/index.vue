<!-- 
  @description: 二次封装el-select-v2组件
    -接口挂了 -> 添加通讯状态 -> 重新加载数据 -> 加载失败提示，
    -大数据量 -> 预加载一部分 -> 惰性加载逐步加载数据,
    -触底加载
  @author: Wnnk
-->
<template>
  <div>
    <el-select-v2
      v-model="selectValue"
      v-bind="$attrs"
      @visible-change="visiableChange($event, url)"
      :options="virtualOptions"
      scrollbar-always-on
    >
      <!-- 自定义item渲染模板 -->
      <template #default="{ item }">
        <div :style="{ display: 'flex' }">
          <span :style="{ flex: 1 }">{{ item.label }}</span>
          <span :style="{ color: 'red', fontSize: '20px', marginLeft: '5px' }">{{
            item.price
          }}</span>
        </div>
      </template>
      <!-- 自定义通讯状态 -->
      <template #empty>
        <div v-if="state === 3">
          error
          <el-button @click="loadData(url)">请稍后重试</el-button>
        </div>
        <div v-else>
          <!-- 自定义空数据模板 -->
          <slot name="emptyData"> </slot>
        </div>
      </template>
      <!-- 自定义加载中模板 -->
      <template #footer v-if="state === 1">
        <div>loading中</div>
      </template>
    </el-select-v2>
  </div>
</template>

<script setup lang="ts">
import { toRefs, ref, defineProps, defineModel, onMounted, watch, nextTick } from 'vue'
import { selectProps } from './selectV2'
import { getSelectData } from '@/api/getSelectData'
import debounce from 'lodash/debounce'

const props = defineProps(selectProps)
const { url } = toRefs(props)
const selectValue = defineModel()
// 0：未加载 ，1：加载中，2:加载完成 3：加载失败
const state = ref(0)
/* 重试次数 */
const retryCount = ref(0)

let dropdownListEl: HTMLElement | null = null

type OptionItem = {
  label: string
  value: string
  price: number
}
const virtualOptions = ref<OptionItem[]>([])
let loadStart = 0
let loadEnd = 50

/**
 * @description:  初始加载部分数据
 * @param url: 请求地址
 * @param start: 开始位置
 * @param end: 结束位置
 **/
const initData = async (url: string, start: number, end: number) => {
  try {
    state.value = 1
    const res = await getSelectData(url, start, end)
    virtualOptions.value.push(...res)
    state.value = 0
    retryCount.value = 0
    loadStart = loadEnd
    loadEnd += 50
  } catch (error) {
    state.value = 3
    console.error(error)
  }
}

/**
 * @description：下拉框显示/隐藏
 * @param visiable: 是否下拉
 **/
const visiableChange = (visiable: boolean, url: string) => {
  if (visiable) {
    // 如果数据已经加载完成，直接绑定滚动事件
    if (virtualOptions.value.length > 0) {
      bindScrollListener()
    } else {
      // 如果数据还未加载完成，监听 options 的变化
      const unwatch = watch(virtualOptions.value, () => {
        if (virtualOptions.value.length > 0) {
          bindScrollListener()
          unwatch() // 绑定后取消监听
        }
      })
    }
  } else {
    // 当下拉框隐藏时，移除滚动事件
    if (dropdownListEl) {
      dropdownListEl.removeEventListener('scroll', handleScroll)
      dropdownListEl = null
    }
  }
}

/**
 * @description: 懒加载数据
 * @param url: 请求地址
 **/
const loadData = async (url: string) => {
  if (state.value === 1) return // 防止重复请求
  try {
    state.value = 1
    console.log('loadData')
    const res = await getSelectData(url, loadStart, loadEnd)
    virtualOptions.value.push(...res)
    state.value = 2
    retryCount.value = 0
    loadStart = loadEnd
    loadEnd += 100
  } catch (error) {
    state.value = 3
    console.error(error)
  }
}

/**
 * @description: 重试
 **/
const retry = () => {
  if (retryCount.value > 2) return
  retryCount.value++
  loadData(url.value)
}

/**
 * @description: 触底加载
 **/
const handleScroll = () => {
  if (!dropdownListEl) return
  const { scrollTop, scrollHeight } = dropdownListEl
  if (scrollTop >= scrollHeight - 400) {
    debounce(loadData, 500)(url.value)
  }
}

// 绑定滚动事件到 .el-select-dropdown__list
const bindScrollListener = () => {
  nextTick(() => {
    dropdownListEl = document.querySelector('.el-select-dropdown__list')
    if (dropdownListEl) {
      dropdownListEl.addEventListener('scroll', handleScroll)
    }
  })
}

onMounted(() => {
  initData(url.value, loadStart, loadEnd)
})

watch(
  () => state.value,
  (newState) => {
    if (newState === 3) {
      retry()
    }
  },
)
</script>

<style lang="scss" scoped>
.custom-select-dropdown .el-select-dropdown__wrap {
  max-height: 200px;
  overflow-y: auto;
}
</style>
