import { request, config } from 'utils'
const { api } = config


export function getTaskHistory(params) {
  return request({
    url: api.getTaskHistory,
    method: 'get',
    data: params,
  })
}

