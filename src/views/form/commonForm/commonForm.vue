<template>
  <el-form :model="form" label-width="auto" style="max-width: 600px">
    <el-form-item label="EquipmentName" prop="name">
      <el-input v-model="form.equipmentName" />
    </el-form-item>

    <el-form-item label="Equipment Id" prop="age">
      <el-input v-model.number="form.equipmentId" type="number" />
    </el-form-item>
    <el-form-item label="temperature" prop="temperature">
      <el-input v-model="form.temperature" type="number" />
    </el-form-item>
    <el-form-item label="heattime" prop="heattime">
      <el-input v-model="form.heattime"></el-input>
    </el-form-item>
    <el-form-item label="humidity" prop="humidity">
      <el-input v-model="form.humidity"></el-input>
    </el-form-item>
    <el-form-item label="pressure" prop="pressure">
      <el-input v-model="form.pressure"></el-input>
    </el-form-item>
    <el-form-item label="City" prop="address.city">
      <el-input v-model="form.address.city"></el-input>
    </el-form-item>
    <el-form-item label="Street" prop="address.street">
      <el-input v-model="form.address.street"></el-input>
    </el-form-item>
    <el-form-item label="Zip" prop="address.zip">
      <el-input v-model="form.address.zip"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="visibleDiff">Diff</el-button>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>
  <DiffTableTest
    v-if="isDiff"
    :originData="originData"
    v-model="isDiff"
    :newFormData="newFormData"
  />
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import cloneDeep from 'lodash/cloneDeep'

import DiffTableTest from './diffTableTest.vue'

const form = ref({
  equipmentName: 'A',
  equipmentId: '123456',
  temperature: 25,
  heattime: 20,
  humidity: 50,
  pressure: 1013,
  address: {
    city: 'New York',
    street: '123 Main St',
    zip: '10001',
  },
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
