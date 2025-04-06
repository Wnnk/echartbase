<template>
  <div class="form-view">
    <div class="form-materials">
      <div v-for="(item, index) in widget" :key="index" class="form-material">
        <el-button @click="addField(item.type)">{{ item.props.label }}</el-button>
      </div>
    </div>
    <div class="form-container">
      <el-form
        ref="formRef"
        :inline="jsonSchema.formConfig.layoutType === 'inline'"
        class="form-inline"
        label-suffix=": "
        :model="formData"
      >
        <component
          v-for="widget in jsonSchema.widgetList"
          :key="widget.id"
          :is="getComponent(widget.type)"
          :widget="widget"
          v-model="formData[widget.id]"
          :currentItem="currentItem"
          @click="currentItem = widget"
          :rules="getFinalRules(widget)"
          :style="widget.props?.style || {}"
          v-bind="widget.props"
          :class="['form-item', { 'item-active': currentItem && currentItem.id === widget.id }]"
        >
        </component>
      </el-form>
    </div>
    <div class="form-item-attributes">
      <attributes
        v-if="currentItem"
        v-model="currentItem"
        :formData="formData[currentItem.id]"
      ></attributes>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import {
  ElInput,
  ElSelect,
  ElOption,
  ElForm,
  ElRadioGroup,
  ElRadio,
  ElCheckboxGroup,
  ElCheckbox,
  ElDatePicker,
  ElTimePicker,
  ElSwitch,
  ElButton,
} from 'element-plus'
import FormSlect from './formItem/select.vue'
import FormRadio from './formItem/radio.vue'
import FormInput from './formItem/input.vue'
import FormTimePick from './formItem/timePick.vue'
import attributes from './attributes/attributes.vue'

import { widget } from './widget'
import draggable from 'vuedraggable'
import type { FormConfig, JsonSchema, Widget } from './type'
import { getFinalRules } from './type'

const formRef = ref<InstanceType<typeof ElForm>>()
const currentItem = ref<Widget | null>(null)
const formData = ref<Record<string, any>>({})

const jsonSchema = ref<JsonSchema>({
  formConfig: {
    id: uuidv4(),
    title: '测试动态表单标题',
    modelName: 'formData',
    refName: 'formRef',
    rulesName: 'rules',
    labelWidth: 100,
    labelPosition: 'left',
    labelAlign: 'left',
    layoutType: 'default',
    size: 'default',
  },
  widgetList: [
    // {
    //   id: uuidv4(),
    //   type: 'input',
    //   name: `input_${Date.now()}`,
    //   icon: 'el-icon-edit',
    //   hidden: false,
    //   labelHidden: false,
    //   required: false,
    //   requiredHint: '',
    //   validation: '',
    //   validationHint: '',
    //   rules: [{ type: 'number', message: 'age must be a number' }],
    //   props: {
    //     label: '输入框',
    //     type: 'text',
    //     placholder: '请输入',
    //     style: {
    //       width: '500px',
    //     },
    //   },
    // },
    // {
    //   id: uuidv4(),
    //   type: 'select',
    //   name: `input_${Date.now()}`,
    //   icon: 'el-icon-s-grid',
    //   hidden: false,
    //   labelHidden: true,
    //   required: false,
    //   requiredHint: '',
    //   validation: '',
    //   validationHint: '',
    //   rules: [],
    //   props: {
    //     label: '下拉框',
    //     options: [
    //       { label: '选项1', value: '1' },
    //       { label: '选项2', value: '2' },
    //       { label: '选项3', value: '3' },
    //     ],
    //     style: {
    //       width: '240px',
    //     },
    //   },
    // },
  ],
})
watch(jsonSchema.value, (newVal) => {
  console.log('jsonSchema', newVal)
})

const componentMap: { [key in ComponentType]: any } = {
  input: FormInput,
  select: FormSlect,
  radio: FormRadio,
  timePick: FormTimePick,
}

type ComponentType = 'input' | 'select' | 'radio' | 'timePick'

const isComponentType = (type: string) => {
  return type in componentMap
}
const getComponent = (type: string) => {
  if (isComponentType(type)) {
    return componentMap[type as ComponentType]
  } else {
    console.error('组件类型不存在')
  }
}

const addField = (type: string) => {
  const target = widget.find((item) => item.type === type)
  if (!target) return
  const field: Widget = {
    ...JSON.parse(JSON.stringify(target)),
    id: uuidv4(),
    name: `${type}_${Date.now()}`,
  }
  jsonSchema.value.widgetList.push(field)
  formData.value[field.id] = '' // 初始化数据
  currentItem.value = field
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
