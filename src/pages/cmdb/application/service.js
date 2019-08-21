import { request, config } from 'utils'

const { api } = config
export function getApps(params) {
  return request({
    url: api.getApps,
    method: 'get',
    data: params,
  })
}


export const addApps = params => {
  return request({
    url: api.addApps,
    method: 'post',
    data: params,
  })
}

export const updateGroups = params => {
  return request({
    url: api.editGroups,
    method: 'put',
    data: params,
  })
}

export const getGroups = params => {
  return request({
    url: api.getGroups,
    method: 'get',
    data: params,
  })
}
