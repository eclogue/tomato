import { request, config } from 'utils'
const { api } = config


export const monitor = params => {
  return request({
    url: api.getTaskMonitor,
    method: 'get',
    data: params,
  })
}
