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

export const editApps = params => {
  const { _id } = params
  return request({
    url: api.editApps.replace(':id', _id),
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
