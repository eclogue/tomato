import { request, config } from 'utils'

const { api } = config
export function getRegions(params) {
  return request({
    url: api.getRegions,
    method: 'get',
    data: params,
  })
}

export const addGroups = params => {
  return request({
    url: api.addGroups,
    method: 'post',
    data: params,
  })
}

export const updateGroups = params => {
  const id = params.id
  if (!id) {
    return Promise.reject('invalid param')
  }

  return request({
    url: api.editGroups.replace(':id', id),
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

export const deleteGroup = params => {
  const id = params._id
  if (!id) {
    return Promise.reject('invalid param')
  }

  return request({
    url: api.editGroups.replace(':id', id),
    method: 'delete',
    data: params,
  })
}
