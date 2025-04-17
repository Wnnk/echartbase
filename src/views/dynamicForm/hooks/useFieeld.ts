import type { Widget, JsonSchema } from "@/views/dynamicForm/type";
import { v4 as uuidv4 } from 'uuid'
import { inject } from "vue";
import type { Ref } from "vue";

export const useField = (widgets:Widget[]) => {
  const jsonSchema = inject<Ref<JsonSchema> | null>("jsonSchema")!
  const formData = inject<Ref<Record<string, any>>>("formData")!; 
  const currentItem = inject<Ref<Widget> | null>("currentItem")!

  /* 添加新字段到表单 */
  const addField = (type: string) => {
    const target = widgets.find((item) => item.type === type)
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

  return {
    addField,
  }

}
