<template>
<div>
  <h1>该页面用于测试切换页面中断请求</h1>
  <button @click="useRequrest">发送请求</button>
  <button @click="handleClick">切换页面</button>
</div>
  <el-row :style="{width: '100vw'}" :gutter="20">
    <el-col :span="5" v-for="(card, index) in cards" :key="index">
       <cardComponent :data="card"  style="margin-top: 20px;" />
    </el-col>
  </el-row>

</template>

<script setup lang='ts'>
import { Request } from '@/request/request';
import { useRouter } from 'vue-router';
import { defineSkeletonComponent } from '@/hooks/useSkeletonComponents'
import Card from './card.vue';
import axios from 'axios';


const cardComponent = defineSkeletonComponent({
  component: Card,
  load: async function load(props) {
    const res = await axios.get(props.data.source.url);
    console.log(res.data);
    return res.data;
  }
});



const cards =[
  {
    title: '测试1',
    content: '测试内容1',
    source: {
      url:"http://localhost:3000/api/testAbort1",
      params:{
        type: "1"
      },
    }
  },
  {
    title: '测试2',
    content: '测试内容1',
    source: {
      url:"http://localhost:3000/api/testAbort1",
      params:{
        type: "1"
      },
    }
  },
  {
    title: '测试3',
    content: '测试内容1',
    source: {
      url:"http://localhost:3000/api/testAbort1",
      params:{
        type: "1"
      },
    }
  },
  {
    title: '测试4',
    content: '测试内容1',
    source: {
      url:"http://localhost:3000/api/testAbort1",
      params:{
        type: "1"
      },
    }
  },
  {
    title: '测试5',
    content: '测试内容1',
    source: {
      url:"http://localhost:3000/api/testAbort1",
      params:{
        type: "1"
      },
    }
  },
  {
    title: '测试6',
    content: '测试内容1',
    source: {
      url:"http://localhost:3000/api/testAbort1",
      params:{
        type: "1"
      },
    }
  },
  
] 




const router = useRouter();
const request = new Request(router);
const useRequrest =  () => {
  try {
    request.get('/testAbort1').then(res => {
      console.log(res);
    })
    request.get('/testAbort2').then(res => {
      console.log(res);
    })
     
  } catch (error) {
    
  }
}
const handleClick = async () => {
  try {
    router.push('/');
  } catch (error) {
    
  }

}
</script>

<style lang='scss' scoped>
</style>