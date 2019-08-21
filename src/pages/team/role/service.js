import { request, config } from 'utils'
const { api } = config


export function getRoles(params) {
  return request({
    url: api.getRoles,
    method: 'get',
    data: params,
  })
}

export const getMenus = params => {
  return request({
    url: api.getMenus,
    method: 'get',
    data: params,
  })
}

export const addRole = params => {
  return request({
    url: api.addRoles,
    method: 'post',
    data: params,
  })
}

export const updateRole = params => {
  console.log('????', params)
  const { _id } = params
  if (!_id) {
    return Promise.reject('invalid id')
  }

  return request({
    url: api.editRoles.replace(':id', _id),
    method: 'put',
    data: params,
  })
}

export const bindRoles = params => {
  const { userId } = params
  if (!userId) {
    return false
  }

  return request({
    url: api.bindRoles.replace(':id', userId),
    method: 'post',
    data: params,
  })
}
