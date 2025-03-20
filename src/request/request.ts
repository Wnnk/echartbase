import axios, { AxiosHeaders } from 'axios'
import type { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

class Request {
  private instance: AxiosInstance
  private maxRequests: number
  private requests: number
  private queue: Function[]
  constructor() {
    this.maxRequests = 3
    this.requests = 0
    this.queue = []

    const config = {
      baseURL: 'http://localhost:3000/api',
      timeout: 10000,
    }
    this.instance = axios.create(config)
    /* 请求拦截器 */
    this.instance.interceptors.request.use((config: AxiosRequestConfig) => {
      const token = localStorage.getItem('token') || ''
      return {
        ...config,
        headers: new AxiosHeaders({
          'x-access-token': token,
        }),
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
        return data.data
      },
      (error: AxiosError) => {
        const { response } = error
        if (response) {
          // handle error
        }
        return Promise.reject(error)
      },
    )
  }

  private handleCode = (code: number) => {
    switch (code) {
      case 4001:
        localStorage.setItem('token', '')
        ElMessage.error('登录失效，请重新登录')
        Promise.reject(new Error('token失效'))
        break
      case 2000:
        break
    }
  }

  private processQueue = () => {
    if (this.requests < this.maxRequests && this.queue.length > 0) {
      const nextRquest = this.queue.shift()
      if (nextRquest) {
        this.requests++
        nextRquest()
      }
    }
  }

  public get = async (url: string, params?: any, headers?:any): Promise<any> => {
    if (this.requests >= this.maxRequests) {
      return new Promise((resolve, reject) => {
        this.queue.push(() => {
          this.instance
            .get(url, { params, headers })
            .then(resolve)
            .catch(reject)
        })
      })
    } else {
      this.requests++
      try {
        return await this.instance.get(url, { params, headers })
      } finally {
        this.requests--
        this.processQueue()
      }
    }
  }

  public post = async (url: string, data?: any,headers?:any): Promise<any> => {
    if (this.requests >= this.maxRequests) {
      return new Promise((resolve, reject) => {
        this.queue.push(() => {
          this.instance.post(url, data, {headers}).then(resolve).catch(reject)
        })
      })
    } else {
      this.requests++
      try {
        return await this.instance.post(url, data, {headers})
      } finally {
        this.requests--
        this.processQueue()
      }
    }
  }
}

export default new Request()
