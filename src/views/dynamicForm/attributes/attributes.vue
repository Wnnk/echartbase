<template>
  <el-form :model="currentItem">
    <el-form-item label="唯一id">
      <el-input v-model="currentItem.id" disabled></el-input>
    </el-form-item>
    <el-form-item label="名称">
      <el-input v-model="currentItem.name" />
    </el-form-item>
    <el-form-item label="标签">
      <el-input v-model="currentItem.props.label" />
    </el-form-item>
    <el-form-item label="字段标签对齐">
      <el-button-group>
        <el-button size="small">居左</el-button>
        <el-button size="small">居中</el-button>
        <el-button size="small">居右</el-button>
      </el-button-group>
    </el-form-item>
    <el-form-item label="显示类型" v-if="currentItem.type === 'input'">
      <el-select v-model="currentItem.props.type">
        <el-option label="text" value="text"></el-option>
        <el-option label="password" value="password"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="字段标签隐藏">
      <el-switch
        v-model="currentItem.labelHidden"
        active-text="隐藏"
        inactive-text="显示"
      ></el-switch>
    </el-form-item>
    <el-form-item label="必填字段">
      <el-switch
        v-model="currentItem.required"
        active-text="必填"
        inactive-text="非必填"
      ></el-switch>
    </el-form-item>
    <el-form-item label="必填校验提示" v-show="currentItem.required">
      <el-input></el-input>
    </el-form-item>
    <el-form-item label="字段校验" v-show="currentItem.required">
      <el-select> </el-select>
    </el-form-item>
    <el-form-item label="校验失败提示" v-show="currentItem.required">
      <el-input></el-input>
    </el-form-item>
  </el-form>

  <el-form v-model="currentItem.props.options" v-if="currentItem.props.options">
    <el-divider>
      <span>选择设置</span>
    </el-divider>
    <el-form-item label="选项">
      <el-radio-group v-model="formData">
        <div v-for="option in currentItem.props.options" class="option-item">
          <el-radio class="option-item-radio" size="small" :value="option.value"></el-radio>
          <el-input class="option-item-input" v-model="option.label">{{ option.label }}</el-input>
          <el-button circle type="danger" class="option-item-delete" size="small">-</el-button>
        </div>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { Widget } from '../type'
const currentItem = defineModel<Widget>({ required: true })
const props = defineProps({
  formData: {
    type: String,
    required: true,
  },
})
const { formData } = props
watch(
  () => formData,
  (val) => {
    console.log(val)
  },
)
</script>

<style lang="scss" scoped>
.option-item {
  display: flex;
  align-items: center;
  justify-content: center;
  .option-item-radio {
    margin-right: 10px;
  }
  .option-item-input {
    flex: 1;
  }
  .option-item-delete {
    margin-left: 10px;
  }
}
</style>
