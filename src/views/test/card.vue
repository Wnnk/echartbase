<template>
  <el-card class="testSkeleton" >
    <template #header>
      <div>
        <span>{{ data.title }}</span>
      </div>
    </template>
    <div class="testSkeleton-content">
      <span>{{ store.message }}</span>
    </div>
  </el-card>



</template>

<script setup lang='ts'>
import { onMounted,ref, getCurrentInstance, reactive, watch } from 'vue';
import axios from 'axios';

defineOptions({
  name: 'Card',
})


const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  store: {
    type: Object,
    required: false,
    default: () => ({})
  },

})










const { data, store } = props
const view = reactive({
  loading:true,
  message:''
})

// async function load() {
//   try {
//     const res = await axios.get(data.source.url);
//     view.message = res.data.message;
//     view.loading = false;
//   } catch (error) {
//     console.log(error)
//   }
// }
// load()


     
// onMounted(() => {
//   try {
//     request.get('/testAbort1').then(res => {
//       message.value = res.message
//     })
//   } catch (error) {
    
//   }

// });
</script>

<style lang='scss' scoped>
.testSkeleton {
  // margin-top: 500px;
  width: 300px;
  height: 300px;
}
</style>