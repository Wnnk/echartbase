<template>
  <div class="form-view">
    <div class="form-materials">
      <Meterials />
    </div>
    <div 
      class="form-container" 
      ref="formContainerRef" 
    >
      <el-form
        ref="formRef"
        :inline="formConfig.layoutType === 'inline'"
        class="form"
        label-suffix=": "
        :model="formData"
        :label-width="labelWidth"
        :label-position="labelPosition"
        :size="size"
      >
        <component
          v-for="widget in widgetList"
          :key="widget.id"
          :is="getComponent(widget.type)"
          :widget="widget"
          v-model="formData[widget.id]"
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
      <attributes></attributes>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue'
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
import Meterials from './materials/materials.vue'

import { widget } from './widget'
import type { FormConfig, JsonSchema, Widget } from './type'
import { getFinalRules } from './type'





const formRef = ref<InstanceType<typeof ElForm>>()
const formContainerRef = ref<HTMLDivElement>()
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
});


const formConfig = computed(() => {
  return jsonSchema.value.formConfig
})

const widgetList = computed(() => {
  return jsonSchema.value.widgetList
})

provide('formConfig', formConfig);
provide('widgetList', widgetList);
provide('currentItem', currentItem);
provide('formData', formData);
provide('jsonSchema', jsonSchema);

const labelWidth = computed(() => {
  if(!!jsonSchema.value.formConfig && !!jsonSchema.value.formConfig.labelWidth) {
    return `${jsonSchema.value.formConfig.labelWidth}px`
  }
  return '80px'
});

const labelPosition = computed(() => {
  if(!!jsonSchema.value.formConfig && !!jsonSchema.value.formConfig.labelPosition) {
    return jsonSchema.value.formConfig.labelPosition
  }
  return 'left'
});



const size = computed(() => {
  if(!!jsonSchema.value.formConfig && !!jsonSchema.value.formConfig.size) {
    return jsonSchema.value.formConfig.size
  }
  return 'default'
});


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

const removeField = (id: string) => {
  /* 寻找表单项 */
  if (!id) return
  const index = jsonSchema.value.widgetList.findIndex((item) => item.id === id);
  if(index === -1) return;
  /* 删除表单项 */
  jsonSchema.value.widgetList.splice(index, 1);
  delete formData.value[id];
  /* 重置当前选中项 */
  if(currentItem.value && currentItem.value.id === id) {
    currentItem.value = null;
  }
  return;
}











</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
