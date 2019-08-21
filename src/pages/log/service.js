import { request, config, storage } from 'utils'

const { api } = config


export function queryLogs(params) {
  return request({
    url: api.getLogs,
    method: 'get',
    data: params,
  })
}
