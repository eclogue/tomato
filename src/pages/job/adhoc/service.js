import { request, config } from 'utils'
export { addJob } from '../playbook/service'

const { api } = config
export function getJobDetail(params) {
  const { id } = params
  if (!id) {
    return Promise.reject('invalid params')
  }

  return request({
    url: api.getJobTasks.replace(':id', id),
    method: 'get',
    data: params,
  })
}


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
    method: 'get',
    data: params,
  })
}
