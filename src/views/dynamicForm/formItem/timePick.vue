<template>
  <el-time-picker v-model="id"> </el-time-picker>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
const id = defineModel()
</script>

<style lang="scss" scoped></style>
