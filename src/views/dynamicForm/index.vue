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
       <el-form-item
        v-for="widget in jsonSchema.widgetList"
        :key="widget.id"
        :label="widget.labelHidden ? undefined : widget.props.label"
        :prop="widget.id"
        :class="[
          'form-item', 
          { 'item-active': currentItem && currentItem.id === widget.id },
        ]"
        :rules="getFinalRules(widget)"
        @click="currentItem = widget"
       >
         <component 
          :is="getComponent(widget.type)" 
          v-bind="widget.props"
          :style="widget.props?.style || {}"
          v-model="formData[widget.id]"
        >
          <template v-if="widget.type === 'select'">
            <el-option 
              v-for="option in widget.props!.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
              >
            </el-option>
          </template>
          <template v-if="widget.type === 'input'">
            <el-input  />
          </template>
          <template v-if="widget.type === 'radio'">
            <el-radio-group v-model="formData[widget.id]">
              <el-radio 
                v-for="option in widget.props!.options"
                :value="option.label" 
                :key="option.value"
              >
                {{ option.label }}
              </el-radio>
            </el-radio-group>
          </template>
      </component>
       </el-form-item>
      </el-form>
    </div>
    <div class="form-item-attributes">
      <el-form v-if="currentItem" :model="currentItem">
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
          <el-select  v-model="currentItem.props.type">
            <el-option label="text" value="text"></el-option>
            <el-option label="password" value="password"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字段标签隐藏" >
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
          <el-select>
           
          </el-select>
        </el-form-item>
        <el-form-item label="校验失败提示">
          <el-input></el-input>
        </el-form-item>

      </el-form>
    </div>
  </div>

</template>

<script setup lang='ts'>
import { ref, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
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
  ElButton
} from 'element-plus'

import draggable from 'vuedraggable';
import type { 
  FormConfig,
  JsonSchema,
  Widget, 
} from './type';
import { getFinalRules } from './type';



const formRef = ref<InstanceType<typeof ElForm>>();
const currentItem = ref<Widget | null>(null);
const formData = ref<Record<string, any>>({});


watch(
  formData.value,
  (newVal) => {
    console.log(newVal,jsonSchema.value.widgetList)
  },
  { deep: true }
)
// watch(
//   () => currentItem.value,
//   (newVal) => {
//     console.log(newVal)
//   },
//   { deep: true }
// )

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
    {
      id: uuidv4(),
      type: 'input',
      name: `input_${Date.now()}`, 
      icon: 'el-icon-edit',
      hidden: false,
      labelHidden: false,
      required: false,
      requiredHint: '',    
      validation: '',           
      validationHint:'',
      rules: [
        { type: 'number', message: 'age must be a number' },
      ],
      props: {
        label: '输入框',
        type: 'text',
        placholder: '请输入',
        style: {
          width:'500px',
        }
      }
    },
    {
      id: uuidv4(),
      type:'select',
      name: `input_${Date.now()}`, 
      icon: 'el-icon-s-grid',
      hidden: false,
      labelHidden: true,
      required: false,
      requiredHint: '',    
      validation: '',           
      validationHint:'',
      rules: [],
      props: {
        label: '下拉框',
        options: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
          { label: '选项3', value: '3' }
        ],
        style: {
          width:'240px',
        }
      }
    }
  ]
})
const createWidget = (arr:Array<Widget>,type:string,props:any,rules:any) => {
  const field: Widget = {
    id: uuidv4(),
    icon: '',
    type,
    name: '',
    hidden: false,
    labelHidden: false,
    required: false,
    requiredHint: '',    
    validation: '',           
    validationHint:'',
    props,
    rules,
  
  }
  arr.push(field)
  return arr

}
let widget:Widget[] =  createWidget([],'input',{
  label: '输入框',
  type: 'text',
  placholder: '请输入',
  style: {
    width:'500px',
  }
},[{ type: 'number', message: 'age must be a number' }])
widget = createWidget(widget,'select',{
  label: '下拉框',
  options: [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3' }
  ],
  style: {
    width:'240px',
  }
},[])
widget = createWidget(widget,'radio',{
  label: '单选框',
  options: [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
  ],
  style: {
    width:'240px',
  }
  },[])
console.log(widget)

// const widget:Widget[] = [
//   {
//     id: "",
//     icon: "",
//     type: 'input',
//     name: "",
//     hidden: false,
//     labelHidden: false,
//     required: true,
//     requiredHint: '',    
//     validation: '',           
//     validationHint:'',
//     rules:[
//       { type: 'number', message: 'age must be a number' },
//     ],
//     props: {
//       label: '输入框',
//       type: 'text',
//       placholder: '请输入',
//       style: {
//         width:'500px',
//       }
//     },
//   },
//   {
//     type: 'select',
//     id: "",
//     icon: "",
//     name: "",
//     hidden: false,
//     labelHidden: true,
//     required: true,
//     requiredHint: '',    
//     validation: '',           
//     validationHint:'',
//     props: {
//       label: '下拉框',
//       options: [
//         { label: '选项1', value: '1' },
//         { label: '选项2', value: '2' },
//         { label: '选项3', value: '3' }
//       ],
//       style: {
//         width:'240px',
//       }
//     },
//   },
//   {
//     type: 'radio',
//     id: "",
//     icon: "",
//     name: "",
//     hidden: false,
//     labelHidden: true,
//     requiredHint: '',    
//     validation: '',           
//     validationHint:'',
//     props: {
//       label: '单选框',
//       options: [
//         { label: '选项1', value: '1' },
//         { label: '选项2', value: '2' },
//         { label: '选项3', value: '3' }
//       ],
//       style: {
//         width:'240px',
//       }
//     },
//   },
// ]



const componentMap:{[key in ComponentType]: any} = {
  'input': ElInput,
  'select': ElSelect,
  'radio': ElRadioGroup,
}

type ComponentType = 'input' | 'select' | 'radio'

const isComponentType = (type:string) => {
  return type in componentMap
}
const getComponent = (type:string) => {
  if(isComponentType(type)) {
    return componentMap[type as ComponentType]
  } else {
    console.error('组件类型不存在');
  }
}

const addField = (type:string) => {
  const target = widget.find(item => item.type === type)
  if(!target) return;
  const field: Widget = {
    ...JSON.parse(JSON.stringify(target)),
    id: uuidv4(),
    name: `${type}_${Date.now()}` 
  };
  jsonSchema.value.widgetList.push(field);
  formData.value[field.id] = '';  // 初始化数据
  currentItem.value = field;
}

</script>

<style lang='scss' scoped>
.form-view{
  display: flex;
  width: 100%;
  height: 100%;
}
.form-materials{
  width: 240px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 2fr));
  grid-gap: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  .form-material{
    height: 50px;
    display: flex;
    justify-content: center;
  }
}
.form-container{
  flex:1;
  background-color: #dbdbdb;
  border-radius: 8px;
  .form-item{
    padding: 10px;
  }
  .item-active {
    border: 1px dashed #409eff;
  }

}




.form-item-attributes{
  width: 240px;
  height: 100%;
}
</style>