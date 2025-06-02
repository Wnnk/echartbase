<template>
  <!-- <el-popover placement="bottom" trigger="manual" width="250">
    <template slot="reference">
      <div class="columns-contents">
        <div class="title">选择需要展示的列</div>
        <div class="label">已选</div>
      </div>
    </template>
  </el-popover> -->
  <el-popover ref="popoverRef" trigger="click" virtual-triggering>
    <div class="columns-contents">
      <div class="title">选择需要展示的列</div>
      <div class="label">已选</div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, reactive, inject, computed } from 'vue'
import type { PropType } from 'vue'
// const { buttonRef } = defineProps({
//   buttonRef: {
//     type: Object as PropType<HTMLButtonElement | null>,
//     required: true,
//     default: null,
//   },
// })
</script>

<style lang="scss" scoped></style>
