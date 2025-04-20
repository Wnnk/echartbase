<template>
  <el-form :model="form" label-width="auto" style="max-width: 600px">
    <el-form-item label="Activity name" prop="name">
      <el-input v-model="form.name" />
    </el-form-item>

    <el-form-item label="Activity age" prop="age">
      <el-input v-model.number="form.age" type="number" />
    </el-form-item>
    <el-form-item label="Activity form" prop="desc">
      <el-input v-model="form.desc" type="textarea" />
    </el-form-item>
    <el-form-item label="City" prop="address.city">
      <el-input v-model="form.address.city"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="visibleDiff">Diff</el-button>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>
  <DiffForm v-if="isDiff" :originData="originData" v-model="isDiff" :newFormData="newFormData" />
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import DiffForm from './diffForm.vue'
const form = reactive({
  name: 'A',
  age: 10,
  address: {
    city: 'New York',
    street: '123 Main St',
    zip: '10001',
  },
  desc: 'This is a test activity.',
})
let newFormData = {}
const originData = cloneDeep(form)
const isDiff = ref(false)

const visibleDiff = () => {
  newFormData = cloneDeep(form)
  isDiff.value = true
}

const onSubmit = () => {
  console.log('submit!')
}
</script>
