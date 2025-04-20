<template>
  <div class="">
    <el-dialog v-model="isAddressForm">
      <el-form :model="data">
        <el-form-item label="Street" prop="street">
          <el-input v-model="data.street"></el-input>
        </el-form-item>
        <el-form-item label="City" prop="city">
          <el-input v-model="data.city"></el-input>
        </el-form-item>
        <el-form-item label="State" prop="state">
          <el-select v-model="data.state">
            <el-option label="New York" value="NY"></el-option>
            <el-option label="California" value="CA"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="save">Save</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
interface Data {
  street: string
  city: string
  state: string
}
const props = defineProps({
  data: {
    type: Object as () => Data,
    required: true,
  },
})
const data = ref(props.data)
const isAddressForm = defineModel()
const emits = defineEmits(['saveAddress'])
const save = () => {
  emits('saveAddress', data.value)
}
</script>

<style lang="scss" scoped></style>
