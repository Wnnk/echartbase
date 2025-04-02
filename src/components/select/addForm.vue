<template>
<div>
  <el-form
    :model="form"
    v-if="currentPage === 1"
    ref="page1Form"
    :rules="rules"
  >
    <el-form-item label="城市名称" prop="cityName">
      <el-input v-model="form.cityName"></el-input>
    </el-form-item>
    <el-form-item label="城市代码"  prop="cityCode">
      <el-input v-model.number="form.cityCode" ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="validateAndNext">下一页</el-button>
    </el-form-item>
  </el-form>

  <el-form :model="form" v-if="currentPage === 2" ref="page2Form" :rules="rules">
    <el-form-item label="城市经度"  prop="cityLongitude">
      <el-input v-model.number="form.cityLongitude" ></el-input>
    </el-form-item>
    <el-form-item label="城市纬度"  prop="cityLatitude">
      <el-input v-model.number="form.cityLatitude" ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="prePage">上一页</el-button>
      <el-button type="primary" @click="validateAndNext">下一页</el-button>
    </el-form-item>
  </el-form>

  <el-form :model="form" v-if="currentPage === 3" ref="page3Form" >
    <el-form-item label="具体市区" prop="cityArea">
      <el-input v-model="form.cityArea"></el-input>
    </el-form-item>
    <el-form-item label="联系电话" prop="contactPhone">
      <el-input v-model="form.contactPhone"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</div>

</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import type { PropType } from 'vue';
type FormType = {
  cityName: string
  cityCode: number | null
  cityLongitude: number | null
  cityLatitude: number | null
  cityArea: string
  contactPhone: string | null
}

const props = defineProps({
  form: {
    type: Object as PropType<FormType>,
  }
})
const form = ref<FormType>({
  cityName: '',
  cityCode: null,
  cityLongitude: null,
  cityLatitude: null,
  cityArea: '',
  contactPhone: null
})

if(props.form) {
  form.value = props.form
}


const page1Form = ref<FormInstance>()
const page2Form = ref<FormInstance>()
const page3Form = ref<FormInstance>()

const rules = reactive<FormRules>({
  cityName: [{ required: true, message: '请输入城市名称', trigger: 'blur'}],
  cityCode: [
    { required: true, message: '请输入城市代码', trigger: 'blur' },
    { type: 'number', message: '必须为数字值', trigger: 'blur' }
  ],
  cityLongitude: [
    { required: true, message: '请输入城市经度', trigger: 'blur' },
   { type: 'number', message: '必须为数字值', trigger: 'blur' }
  ],
  cityLatitude: [
    { required: true, message: '请输入城市纬度', trigger: 'blur'}
    , { type: 'number', message: '必须为数字值', trigger: 'blur' }
  ],
 
})

const currentPage = ref(1);
const totalPage = ref(3);

const cacheForm = () => {
  sessionStorage.setItem('formCache', JSON.stringify(form.value))
}
const clearFormSession = () => {
  sessionStorage.removeItem('formCache')
}
const prePage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

const validateAndNext = async () => {
  let formRef: FormInstance | undefined
  // 根据当前页面获取对应表单引用
  if (currentPage.value === 1) formRef = page1Form.value
  else if (currentPage.value === 2) formRef = page2Form.value
  else formRef = page3Form.value

  if (!formRef) return

  try {
    await formRef.validate()
    if (currentPage.value < totalPage.value) {
      currentPage.value++
      cacheForm()
    }
  } catch (error) {
    console.log('验证失败:', error)
  }
}

const handleSubmit = async () => {
  if (page3Form.value) {
    const isValid = await page3Form.value.validate()
    if (isValid) {
      console.log('提交表单:', form.value)
      clearFormSession()
      // 这里可以添加提交逻辑
    }
  }
}
</script>

<style lang='scss' scoped>
</style>