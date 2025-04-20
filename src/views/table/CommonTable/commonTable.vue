<template>
  <div class="common-table">
    <el-table
      :data="tableData"
      style="width: 60"
      border
      @expand-change="expandAddress"
      row-key="id"
      :expand-row-keys="expanedRow"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="expand" label="address" width="240">
        <template #default="expand">
          <div>
            <p>Street:</p>
            <p>{{ expand.row.address.street }}</p>
            <p>City:</p>
            <p>{{ expand.row.address.city }}</p>
            <p>State:</p>
            <p>{{ expand.row.address.state }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Date" width="120">
        <template #default="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column property="name" label="Name" width="120" />
      <el-table-column
        property="address.street"
        label="use show-overflow-tooltip"
        width="240"
        show-overflow-tooltip
      />

      <el-table-column property="address.city" label="city" />
      <el-table-column property="age" label="Age" width="120"></el-table-column>
      <el-table-column property="edit" label="edit">
        <template #default="scope">
          <el-button @click="editTable(scope.row)">edit</el-button>
        </template>
      </el-table-column>
    </el-table>

    <EditForm v-if="isEditForm" :data="editForm" v-model="isEditForm" @sbumitForm="sbumitForm" />
    <ExpanedForm
      v-if="isAddressForm"
      :data="expandedForm"
      v-model="isAddressForm"
      @saveAddress="saveAddress"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { getTable, updateTable } from '@/api/table/getTable'
import type { User } from '@/api/table/getTable'
import EditForm from './editForm.vue'
import cloneDeep from 'lodash/cloneDeep'
import ExpanedForm from './expanedForm.vue'

const tableData = ref<User[]>([])
const isEditForm = ref(false)
const originData = ref<User | null>()
const editForm = ref<User>({
  id: 0,
  date: '',
  name: '',
  address: {
    street: '',
    city: '',
    state: '',
  },
  age: 0,
})

const requestData = async () => {
  tableData.value = await getTable()
}
requestData()

const editTable = (row: User) => {
  editForm.value = cloneDeep(row)
  isEditForm.value = true
}

const expandedForm = ref({
  ...editForm.value.address,
})
const isAddressForm = ref(false)
const expanedRow = ref<number[]>([])
const expandAddress = (row: User, expanded: any) => {
  if (expanded.length) {
    expanedRow.value = [row.id]
    expandedForm.value = cloneDeep(row.address)
    isAddressForm.value = true
  } else {
    expanedRow.value = []
  }
}

const saveAddress = async (val: any) => {
  isAddressForm.value = false
  /* 保存数据 */
  const newData = []
  console.log(val)
  for (let item of tableData.value) {
    if (item.id === expanedRow.value[0]) {
      item.address = val
    }
    newData.push(item)
  }
  tableData.value = await updateTable(newData)
}

const sbumitForm = async (val: User) => {
  console.log(val)
  isEditForm.value = false
  /* 重新获取数据 */
}
</script>

<style lang="scss" scoped>
.common-table {
  display: flex;
  width: 60vw;
  flex-direction: column;
  align-items: center;
  margin: 20px;
}
</style>
