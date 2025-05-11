<template>
  <div>
    <h1>Dialog使用界面</h1>
    <el-button @click="selectType">createDialog</el-button>
    <el-button @click="selectLogin">loginDialog</el-button>
  </div>
</template>

<script setup lang="ts">
import { createDialog } from '@/utils/createDialog'
import getTypeComponent from './components/getType.vue'
import Login from '@/views/Dialog/components/login.vue'
import { ref } from 'vue'
import _ from 'lodash'

const getTypeDialog = createDialog(getTypeComponent, {
  title: '选择类型1',
})
const selectType = async () => {
  try {
    const type = await getTypeDialog()
  } catch (error) {}
}

const loginDialog = createDialog(Login, {
  title: '登录',
  width: '800px',
  center: true,
  alignCenter: true,
  draggable: true,
  showClose: true,
  modal: true,
  top: '20vh',
})
const selectLogin = async () => {
  try {
    const result = await loginDialog()
  } catch (error) {}
}
</script>

<style lang="scss" scoped></style>
