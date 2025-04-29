import { defineAsyncComponent,  h, render } from "vue";
import { ElSkeleton } from 'element-plus'
import {ref , getCurrentInstance, onMounted, watch, defineProps } from 'vue'
import type { DefineComponent } from 'vue'


export function defineSkeletonComponent({
  component,
  load,
}){
  return {
    props:component.props,
    setup() {
      const flag = ref(true);
      /* observer的回调 */
      const callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        entries.forEach((entry) => {
          if(entry.isIntersecting){
            console.log('可见');
            flag.value = false;
            /* 停止观察 */
            observer.unobserve(entry.target);
          }
        });
      }

      /* 创建观察者 */
      const options = {
        root: null, // 根元素
        rootMargin: '0px', // 根元素与目标元素的距离
        threshold: 1.0 // 阈值
      }
      const observer = new IntersectionObserver(callback, options);
      const instance = getCurrentInstance()!;
      onMounted(() => {
        observer.observe(instance.ctx.$el);
      });

      const loading = ref();
      let data = {};
      const unwatch = watch(() => flag.value, async (flag) => {
        if(!flag){
          try {
            loading.value = true;
            data = await load(instance.ctx.$props);
          } catch (error) {
            console.error(error);
          }
          loading.value = false;
          unwatch();
        }
      })

      return () => {
        if(flag.value || loading.value){
           return h(ElSkeleton,{
            animated: true,
           })
        } else {
          return h(component, {
            ...instance.ctx.$props,
            store:data,
            
          })
          
        }
       
      }
    }
  }
}


