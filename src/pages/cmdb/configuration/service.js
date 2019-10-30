import { request, config } from 'utils'
const { api } = config

export function getConfigurations(params) {
  return request({
    url: api.getConfigs,
    method: 'get',
    data: params,
  })
}

export const getConfiguration = params => {
  const id = params._id
  if (!id) {
    return false
  }

  return request({
    url: api.getConfig.replace(':id', id),
    method: 'get',
    data: {},
  })
}

export const addConfig = params => {
  return request({
    url: api.addConfigs,
    method: 'post',
    data: params,
  })
}

export const editConfig = params => {
  const { _id } = params
  return request({
    url: api.getConfig.replace(':id', _id),
    method: 'put',
    data: params,
  })
}

export const delConfig = params => {
  const id = params._id
  if (!id) {
    return false
  }

  return request({
    url: api.getConfig.replace(':id', id),
    method: 'delete',
    data: {},
  })
}
