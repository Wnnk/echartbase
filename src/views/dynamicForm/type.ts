type labelPosition = 'left' | 'top'
type labelAlign = 'left' | 'right' | 'center'
type size = 'default' | 'small' | 'large'
type layoutType = 'default' | 'inline'


export interface JsonSchema {
  formConfig: FormConfig
  widgetList: Widget[]
}

export interface FormConfig {
  modelName: string // 表单模型名称
  refName: string // 表单ref名称
  rulesName?: string // 表单验证规则名称
  labelWidth: number // 标签宽度
  labelPosition: labelPosition // 标签位置
  labelAlign: labelAlign // 标签对齐方式
  layoutType: layoutType // 布局类型
  size: size // 尺寸
  id: string // 表单id
  title?: string // 表单标题
  submitBtnText?: string // 提交按钮文字
  resetBtnText?: string // 重置按钮文字
  submitBtnType?: string // 提交按钮类型
  resetBtnType?: string // 重置按钮类型
  submitBtnSize?: string // 提交按钮尺寸
  resetBtnSize?: string // 重置按钮尺寸
  submitBtnIcon?: string // 提交按钮图标
  resetBtnIcon?: string // 重置按钮图标
  submitBtnDisabled?: boolean // 提交按钮禁用
  resetBtnDisabled?: boolean // 重置按钮禁用
  submitBtnLoading?: boolean // 提交按钮加载中
  resetBtnLoading?: boolean // 重置按钮加载中
}

export interface Widget {
  id: string // 组件id
  type: string // 组件类型
  name: string // 组件名称
  icon?: string // 组件图标
  hidden: boolean // 组件隐藏
  required?: boolean // 组件必填
  labelHidden: boolean // 标签隐藏
  requiredHint: string // 必填校验提示
  validation: string // 校验字段
  validationHint: string // 校验失败提示
  rules?: any[] // 组件验证规则
  span: number // 组件跨度
  props: {
    // 组件属性
    [key: string]: any
  }
  children?: Widget[] // 子组件
}

export interface FormState {
  schema: JsonSchema
  data: Record<string, any>
}

export const getFinalRules = (widget: Widget) => {
  const rules = widget.rules ? [...widget.rules] : []
  /* 设置了required但rules中没有required规则时，添加required规则 */
  if (widget.required && !rules.some((rule) => rule.required)) {
    rules.unshift({
      required: true,
      message: '该字段为必填项',
      trigger: 'blur',
    })
  }
  return rules.length > 0 ? rules : undefined
}
