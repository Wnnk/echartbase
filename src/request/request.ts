import axios, { AxiosHeaders } from 'axios'
import type { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig, Axios } from 'axios'
import { ElMessage } from 'element-plus'
import type { Router} from 'vue-router'
import { createDialog } from '@/utils/createDialog'
import Login from '@/views/Dialog/components/login.vue'
import { ca } from 'element-plus/es/locale/index.mjs'

interface RequestController {
  controller: AbortController
  requestId: symbol
}

class Request {
  private instance: AxiosInstance
  private maxRequests: number
  private requests: number
  private queue: Function[]
  /* 页面请求控制器 */
  private pageRequest: Map<string, RequestController[]>

  constructor(router?: Router) {
    this.maxRequests = 3
    this.requests = 0
    this.queue = []
    this.pageRequest = new Map();
    const config = {
      baseURL: 'http://localhost:3000/api',
      timeout: 10000,
    }
    this.instance = axios.create(config);

    if(router){
      this.setupRouterGuard(router)
    }
      
    
    
  

    /* 请求拦截器 */
    this.instance.interceptors.request.use((config: AxiosRequestConfig) => {
      /* 设置token请求头 */
      const token = localStorage.getItem('token') || '';
      /* 每个页面请求前，添加请求控制器 */
      const currentRoute = window.location.pathname;
      const controller = new AbortController();
      const requestId = Symbol('requestId');
      
      if(!this.pageRequest.has(currentRoute)) {
        this.pageRequest.set(currentRoute, [])
      }
      this.pageRequest.get(currentRoute)?.push({ controller, requestId })

      return {
        ...config,
        signal: controller.signal,
        headers: new AxiosHeaders({
          'authorization': token,
        }),
        requestId,
      }
    })
    /* 响应拦截器 */
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data, config } = response
        this.handleCode(data.code)
        this.requests--
        /* 处理队列 */
        this.processQueue()
        return data
      },
      (error: AxiosError) => {
        if(error.config) {
          this.cleanupRequest(error.config);
        }
        this.requests--
        this.processQueue()
        if( axios.isCancel(error) ) {
          console.log('请求取消', error.message)
          return Promise.reject(new Error('请求取消'))
        }
        const { response } = error
        if (response) {
          // handle error
        }
        return Promise.reject(error)
      },
    )
  }

  /* 清理成功返回的请求 */
  private cleanupRequest = (config: AxiosRequestConfig) => {
    const currentRoute = window.location.pathname;
    const requestId = config.requestId as symbol;
    const controllers = this.pageRequest.get(currentRoute);
    if(controllers) {
      const index = controllers.findIndex( c => c.requestId === requestId);
      if(index !== -1) {
        controllers.splice(index, 1);
      }
      if(controllers.length === 0) {
        this.pageRequest.delete(currentRoute);
      }
    }
  }

  /* 路由守卫跳转页面时，触发取消页面请求 */
  private setupRouterGuard(router: Router) {
    router.beforeEach((to, from, next) => {
      this.abortPageReuqests(from.path);
      next();
    })
  }
  /* 取消页面请求 */
  private abortPageReuqests(routePath: string) {
    const controllers = this.pageRequest.get(routePath);
    if(controllers) {
      controllers.forEach(({controller}) => {
        controller.abort();
      })
      this.pageRequest.delete(routePath);
    }
  }
  /* 根据返回码处理 */
  private handleCode = (code: number) => {
    switch (code) {
      case 4001:
        localStorage.setItem('token', '')
        ElMessage.error('登录失效，请重新登录')
        Promise.reject(new Error('token失效'))
        break;
      case 1001:
        this.loginToUpdateToken()
      case 2000:
        break
    }
  }

  private loginToUpdateToken = async () => {
    const loginDialog = createDialog(Login, {
      title: 'axios登录',
      fullscreen: true,
      lock: true,
      message: '登录信息已过期，请重新登录',
      showClose: false,
    })
    try {
      const result = await loginDialog()
    } catch (error) {
      
    }
  }

  /* 处理队列 */
  private processQueue = () => {
    if (this.requests < this.maxRequests && this.queue.length > 0) {
      const nextRquest = this.queue.shift()
      if (nextRquest) {
        this.requests++
        nextRquest()
      }
    }
  }

  /* 请求指纹 */
  private fingerprint = (config: AxiosRequestConfig) => {
    const { url, method, data } = config
    return `${url}${method}${JSON.stringify(data)}`
  }

  public get = async (url: string, params?: any, config:AxiosRequestConfig = {}): Promise<any> => {
    if (this.requests >= this.maxRequests) {
      return new Promise((resolve, reject) => {
        this.queue.push(() => {
          this.instance
            .get(url, { params, ...config })
            .then(resolve)
            .catch(reject)
        })
      })
    } else {
      this.requests++
      try {
        return await this.instance.get(url, { params, ...config })
      } finally {
        this.requests--
        this.processQueue()
      }
    }
  }

  public post = async (url: string, data?: any,config:AxiosRequestConfig = {}): Promise<any> => {
    if (this.requests >= this.maxRequests) {
      return new Promise((resolve, reject) => {
        this.queue.push(() => {
          this.instance.post(url, data, config).then(resolve).catch(reject)
        })
      })
    } else {
      this.requests++
      try {
        return await this.instance.post(url, data, config)
      } finally {
        this.requests--
        this.processQueue()
      }
    }
  }

  public delete = async (url: string,  config:AxiosRequestConfig = {}): Promise<any> => {
    if (this.requests >= this.maxRequests) {
      return new Promise((resolve, reject) => {
        this.queue.push(() => {
          this.instance.delete(url, config).then(resolve).catch(reject)
        })
      })
    } else {
      this.requests++
      try {
        return await this.instance.delete(url, config)
      } finally {
        this.requests--
        this.processQueue()
      }
    }
  }
}

export default new Request()

export { Request }