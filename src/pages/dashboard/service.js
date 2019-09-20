import { request, config, storage } from 'utils'

const { api } = config


export function dashboard(params) {
  return request({
    url: api.dashboard,
    method: 'get',
    data: params,
  })
}
