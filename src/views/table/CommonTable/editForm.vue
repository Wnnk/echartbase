<template>
  <div>
    <el-dialog v-model="visible">
      <el-form :rules="rules" ref="formEl" :model="formData" class="edit-form">
        <template v-for="(val, key) in formData" :key="key">
          <template v-if="isObject(formData[key])">
            <div v-for="(nestedVal, nestedKey) in formData[key]" :key="nestedKey">
              <el-form-item :label="nestedKey" :prop="`${key}.${nestedKey}`">
                <el-input v-model="formData[key][nestedKey]"></el-input>
              </el-form-item>
            </div>
          </template>
          <template v-else>
            <el-form-item :label="key" :prop="key">
              <el-input v-model="formData[key]" v-if="key !== 'age'"></el-input>
              <el-input v-model.number="formData[key]" v-else></el-input>
            </el-form-item>
          </template>
        </template>
        <el-button @click="userSave">Save</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, watch } from 'vue'
import type { User } from '@/api/table/getTable'
import { type FormRules, type FormInstance, ElMessageBox } from 'element-plus'

const props = defineProps({
  data: {
    type: Object as () => User,
    required: true,
  },
})

const formEl = ref<FormInstance>()

// 创建表单数据的响应式副本
const formData = ref<User>({ ...props.data })

const visible = defineModel()

const isObject = (value: any) => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const checkAge = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('Please input the age'))
  }
  setTimeout(() => {
    if (!Number.isInteger(value)) {
      callback(new Error('Please input digits'))
    } else {
      if (value < 18) {
        callback(new Error('Age must be greater than 18'))
      } else {
        callback()
      }
    }
  }, 200)
}

const checkName = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('Please input the name'))
  }
  setTimeout(() => {
    if (value.length < 2) {
      callback(new Error('Name must be at least 2 characters'))
    } else if (value.length > 10) {
      callback(new Error('Name must be no more than 10 characters'))
    } else {
      callback()
    }
  }, 200)
}

const rules = reactive<FormRules<typeof formData>>({
  age: [{ validator: checkAge, trigger: 'blur' }],
  name: [{ validator: checkName, trigger: 'blur' }],
})

const emits = defineEmits(['sbumitForm'])

const userSave = async () => {
  try {
    const isValid = await formEl.value?.validate()

    emits('sbumitForm', formData.value)
  } catch (error) {
    console.log(error)
    scrollToFirstError()
    return
  }
}

const scrollToFirstError = () => {
  const firstError = document.querySelector(
    '.el-form-item.is-error, ' + // Element UI
      '.is-error, ' + // 通用错误类
      '[aria-invalid="true"]', // ARIA 无效标记
  )

  if (firstError) {
    firstError.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style lang="scss" scoped>
.edit-form {
  height: 200px;
  overflow: auto;
}
</style>
