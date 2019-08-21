import { request, config, storage } from 'utils'

const { api } = config


export function getNotifications(params) {
  return request({
    url: api.getNotifications,
    method: 'get',
    data: params,
  })
}

export function markRead(params) {
  return request({
    url: api.markNotifications,
    method: 'put',
    data: params,
  })
}
