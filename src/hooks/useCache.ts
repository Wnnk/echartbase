import { ref, onUnmounted, watch, version } from 'vue'
import request from '@/request/request'

type Cachelocation = 'localStorage' | 'sessionStorage' | 'indexedDB' | 'server'

interface CacheOptions {
  encipher?: boolean
  autoSave?: boolean
  debounceTime?: number
  cacheExpire?: number
  cachelocation?: Cachelocation
  url?: string
  versionControl?: boolean
}

interface VersionedData {
  data: any
  version?: number
  lastModified?: number
}

const useFormCache = <T extends object>(cacheKey: string, options: CacheOptions = {}) => {
  const defaultOptions: CacheOptions = {
    encipher: false,
    autoSave: true,
    debounceTime: 2000,
    cacheExpire: 1000 * 60 * 60 * 24 * 30,
    cachelocation: 'localStorage',
    url: '',
    versionControl: false,
  }
  const mergedOptions: CacheOptions = { ...defaultOptions, ...options }
  const { encipher, autoSave, debounceTime, cacheExpire, cachelocation, url, versionControl } =
    mergedOptions
  const shouldUseVersionControl = versionControl && cachelocation === 'server' && url

  let debounceTimer: number | null = null
  /* indexedDB */
  let db: any = null

  /* 后端存储 */
  let lastVersionData: VersionedData | null = null;

  const loadData = () => {
    if (cachelocation === 'localStorage') {
      const storage = localStorage.getItem(cacheKey)
      if (!storage) return {}
      const { value, expiry } = JSON.parse(storage)

      if (Date.now() > expiry) {
        localStorage.removeItem(cacheKey)
        return {}
      }
      return value
    } else if (cachelocation === 'sessionStorage') {
      const storage = sessionStorage.getItem(cacheKey)
      if (!storage) return {}
      const { value, expiry } = JSON.parse(storage)
      if (Date.now() > expiry) {
        sessionStorage.removeItem(cacheKey)
        return {}
      }
      return value
    }
  }

  const loadFromServer = async (): Promise<VersionedData | {}>  => {
    if (!url) return {}
    try {
      const response = await request.get(url, { key: cacheKey });
      lastVersionData =  response;
      return response.data || {}
    } catch (error) {
      console.error('从服务器获取缓存失败:', error)
      return {}
    }
  }

  /* 表单缓存获取，如果缓存存在，则返回缓存，否则返回空对象 */
  const loadFromCache = async () => {
    if (!cacheKey || !cachelocation) return {}
    let cacheData: any = null
    switch (cachelocation) {
      case 'localStorage':
        cacheData = loadData()
        return cacheData || {}
      case 'sessionStorage':
        cacheData = loadData()
        return cacheData || {}
      case 'indexedDB':
        cacheData = await readDataFromindexedDB(cacheKey)
        return cacheData || {}
      case 'server':
        loadFromServer()
        break
      default:
        return {}
    }
  }

  const saveToLocalStorage = (data: any) => {
    try {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          value: data,
          expiry: Date.now() + cacheExpire!,
        }),
      )
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error.name === 'QuotaExceededError' ||
          error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
          error.name === 'QUOTA_EXCEEDED_ERR')
      ) {
        console.warn('储存空间不足，考虑indexDB缓存或清除缓存')
      }
    }
  }
  /* sessionStorage缓存 */
  const saveToSessionStorage = (data: any) => {
    try {
      sessionStorage.setItem(
        cacheKey,
        JSON.stringify({
          value: data,
          expiry: Date.now() + cacheExpire!,
        }),
      )
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error.name === 'QuotaExceededError' ||
          error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
          error.name === 'QUOTA_EXCEEDED_ERR')
      ) {
        console.warn('储存空间不足，考虑indexDB缓存或清除缓存')
      }
    }
  }
  /* indexedDB缓存 */
  const saveToIndexDB = async (data: any) => {
    try {
      db = await openIndexDB()
      writeDataToIndexedDB(data)
    } catch (error) {
      console.log(error)
    }
  }
  /* 打开indexedDB */
  const openIndexDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      let request = window.indexedDB.open('cacheForm', 1)
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains('cacheForm')) {
          const objectStore = db.createObjectStore('cacheForm', { keyPath: 'cacheKey' })
          console.log('对象存储cacheForm创建成功', objectStore)
        }
      }
      request.onsuccess = (event: Event) => {
        const resDB = (event.target as IDBOpenDBRequest).result
        resolve(resDB)
      }
      request.onerror = (event: Event) => {
        console.error('打开数据库失败:', (event.target as IDBOpenDBRequest).error)
        reject((event.target as IDBOpenDBRequest).error)
      }
    })
  }
  /* 写入indexedDB */
  const writeDataToIndexedDB = async (data: any): Promise<void> => {
    if (!db) {
      db = await openIndexDB()
    }

    return new Promise((resolve, reject) => {
      const transaction = db!.transaction('cacheForm', 'readwrite')
      const objectStore = transaction.objectStore('cacheForm')

      const writeData = {
        ...data,
        cacheKey,
      }

      // 将数据转换为普通对象（如果是Vue响应式对象）
      const rawData = JSON.parse(JSON.stringify(writeData))

      const request = objectStore.put(rawData)

      request.onsuccess = () => {
        console.log('数据保存成功')
        resolve()
      }

      request.onerror = (event: Event) => {
        console.error('数据保存失败:', (event.target as IDBRequest).error)
        reject((event.target as IDBRequest).error)
      }
    })
  }
  /* 从indexedDB读取数据 */
  const readDataFromindexedDB = async (key: string): Promise<any> => {
    if (!db) {
      db = await openIndexDB()
    }
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('cacheForm', 'readonly')
      const objectStore = transaction.objectStore('cacheForm')
      const request = objectStore.get(key)
      request.onsuccess = (event: Event) => {
        console.log('indexedDB数据读取成功')
        resolve((event.target as IDBRequest).result)
      }
      request.onerror = (event: Event) => {
        console.error('indexedDB数据读取失败', event)
        reject((event.target as IDBRequest).error)
      }
    })
  }

  /* 从indexedDB删除数据 */
  const deleteDataFromindexedDB = async (key: string): Promise<void> => {
    if (!db) {
      db = await openIndexDB()
    }
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('cacheForm', 'readwrite')
      const objectStore = transaction.objectStore('cacheForm')
      const request = objectStore.delete(key)
      request.onsuccess = () => {
        console.log('indexedDB数据删除成功')
        resolve()
      }
      request.onerror = (event: Event) => {
        console.error('indexedDB数据删除失败', event)
        reject((event.target as IDBRequest).error)
      }
    })
  }



  /* 保存到服务器 */
  const saveToServer = async (data: any) => {
    if (!shouldUseVersionControl) {
      console.warn('无法使用服务器缓存，请检查配置')
      return
    }
    try {
      /* 获取最新版本 */
      let latest = null;
      if(lastVersionData === null) {
        latest = await request.get(url, { key: cacheKey })
      }
      latest = lastVersionData || latest
      const lastVersion = latest.data?.version || 0
      const versionedData = {
        data: data,
        version: lastVersion + 1,
        lastModified: Date.now(),
      }
      /* 本地更新 */
      lastVersionData = versionedData;
      /* 发送请求 */
      const response = await request.post(url, versionedData);
      console.log('数据保存成功')
    } catch (error) {
      console.error('保存到服务器失败:', error)
    }
  }


  /* 发送删除请求到服务器 */
  const deleteFromToServer = async (cacheKey: string) => {
    if (!shouldUseVersionControl) {
      console.warn('无法使用服务器缓存，请检查配置');
      return;
    }
    try {
      const response = await request.delete(`${url}/${cacheKey}`);
      console.log('数据删除成功')

    }catch(error) {
      console.error('删除缓存失败:', error)
    }

  }

  const saveToCache = (data: any) => {
    switch (cachelocation) {
      case 'localStorage':
        saveToLocalStorage(data)
        break
      case 'sessionStorage':
        saveToSessionStorage(data)
        break
      case 'indexedDB':
        saveToIndexDB(data)
        break
      case 'server':
        saveToServer(data)
        break
      default:
        break
    }
  }

  /* 手动保存缓存 */
  const saveNow = (data: any) => {
    if (debounceTime) {
      clearTimeout(debounceTime)
    }
    saveToCache(data)
  }

  /* 自动保存 */
  const setupAutoSave = (data: any) => {
    if (!autoSave) return
    watch(
      () => data,
      (newVal) => {
        if (debounceTimer) {
          clearTimeout(debounceTimer)
        }
        debounceTimer = setTimeout(() => {
          saveToCache(newVal)
        }, debounceTime)
      },
      { deep: true },
    )
  }


  /* 清除缓存 */
  const clearCache = () => {
    switch (cachelocation) {
      case 'localStorage':
        localStorage.removeItem(cacheKey)
        break
      case 'sessionStorage':
        sessionStorage.removeItem(cacheKey)
        break
      case 'indexedDB':
        deleteDataFromindexedDB(cacheKey)
       break
      case 'server':
        deleteFromToServer(cacheKey)
        break
      default:
        break
    }
  }

  /* 清除定时器 */
  onUnmounted(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
  })

  return {
    loadFromCache,
    saveNow,
    setupAutoSave,
    clearCache,
  }
}

export default useFormCache
