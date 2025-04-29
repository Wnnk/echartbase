import { ref, watch, onUnmounted } from 'vue'

interface FormCacheOptions{
  autoSave?: boolean
  debounceTime?: number
  storage?: Storage
}

export default function useFormCache<T extends object>(
  cacheKey: string,
  options: FormCacheOptions = {}
) {
  const  { autoSave = true, 
    debounceTime =5000, 
    storage = typeof window !== 'undefined' ? localStorage : null 
  } = options;

  /* 获取缓存值 */
  const loadFromCache  = ():T | null => {
    if(!storage) return null;
    try {
      const cachedData = storage.getItem(`formCache_${cacheKey}`);
      return cachedData ? JSON.parse(cachedData) : null;
    } catch (error) {
      console.error(`表单缓存获取失败：${error}`);
      return null;
    }
  }

  
  let debounceTimer: number | null = null;

  /* 缓存数据 */
  const saveToCache = (data: T) => {
    if(!storage) return;
    try {
      storage.setItem(`formCache_${cacheKey}`, JSON.stringify(data));
    } catch (error) {
      console.error(`表单缓存失败：${error}`);
    }
  }
  /* 清除缓存 */
  const clearCache = () => {
    if(!storage) return;
    try {
      storage.removeItem(`formCache_${cacheKey}`);
    } catch (error) {
      console.error(`表单缓存清除失败：${error}`);
    }
  }

  /* 自动保存 */

  const setupAutoSave = (formData: T) => {
    if(!autoSave) return;
    watch(
      () => formData,
      (newValue) => {
        if(debounceTimer) {
          clearTimeout(debounceTimer);
        }
        debounceTimer = window.setTimeout(() => {
          saveToCache(newValue);
        }, debounceTime);
      },
      { deep: true }
    )
  }


  /* 手动保存 */
  const saveNow = (data: T) => {
    if(debounceTimer) {
      clearTimeout(debounceTimer);
    }
    saveToCache(data);
  };

  /* 组件卸载时清除定时器 */
  onUnmounted(() => {
    if(debounceTimer) {
      clearTimeout(debounceTimer);
    }
  })

 return {
  loadFromCache,
  setupAutoSave,
  saveNow,
  clearCache
 }
}