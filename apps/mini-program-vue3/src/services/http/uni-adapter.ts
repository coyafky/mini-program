import axios, { AxiosError, type AxiosAdapter, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

function buildRequestUrl(config: InternalAxiosRequestConfig) {
  const baseURL = config.baseURL || ''
  const url = config.url || ''

  if (config.params) {
    return axios.getUri({
      ...config,
      baseURL,
      url,
    })
  }

  return `${baseURL}${url}`
}

export const uniAdapter: AxiosAdapter = (config) => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    const requestTask: any = uni.request({
      url: buildRequestUrl(config),
      method: (config.method || 'GET').toUpperCase() as any,
      data: config.data,
      header: (config.headers || {}) as Record<string, string>,
      timeout: config.timeout,
      success: (response) => {
        resolve({
          data: response.data,
          status: response.statusCode,
          statusText: String(response.statusCode),
          headers: response.header as Record<string, string>,
          config,
          request: requestTask,
        })
      },
      fail: (error) => {
        reject(
          new AxiosError(
            error.errMsg || 'Network Error',
            AxiosError.ERR_NETWORK,
            config,
            requestTask,
          ),
        )
      },
    })

    config.signal?.addEventListener?.('abort', () => {
      requestTask.abort()
      reject(new AxiosError('Request aborted', AxiosError.ERR_CANCELED, config, requestTask))
    })
  })
}
