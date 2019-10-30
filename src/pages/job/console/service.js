import { request, config } from 'utils'

const { api } = config

export const queryAnsibleDoc = params => {
  return request({
    url: api.queryAnsibleDoc,
    method: 'get',
    data: params,
  })
}

export const searchModules = params => {
  return request({
    url: api.searchModules,
    method: 'get',
    data: params,
  })
}

export const searchInventory = params => {
  return request({
    url: api.searchInventory,
    method: 'get',
    data: params,
  })
}

export const previewInventory = params => {
  const url = api.previewInventory
  return request({
    url: url,
    method: 'post',
    data: params,
  })
}

export const execute = params => {
  const url = api.console
  return request({
    url: url,
    method: 'post',
    data: params,
  })
}
