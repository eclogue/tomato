import { request, config } from 'utils'

const { api } = config

export function getSetting(params) {
  return request({
    url: api.getSetting,
    method: 'get',
    data: params,
  })
}

export function addSetting(params) {
  return request({
    url: api.addSetting,
    method: 'post',
    data: params,
  })
}
