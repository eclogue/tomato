import { request, config, storage } from 'utils'

const { api } = config

export function profile(params) {
  const user = storage.get('user')
  return request({
    url: api.getProfile.replace(':id', user.user_id),
    method: 'get',
    data: params,
  })
}

export const security = profile
export const alert = profile

export function sshkey(params) {
  return request({
    url: api.getCredentials,
    method: 'get',
    data: params,
  })
}

export function getUserInfo(params) {
  const { id } = params
  if (!id) {
    return Promise.reject('Illegal ID')
  }

  return request({
    url: api.getUserInfo.replace(':id', id),
    method: 'get',
  })
}

export function addUser(params) {
  return request({
    url: api.addUser,
    method: 'post',
    data: params,
  })
}

export const getCurrentRoles = params => {
  return request({
    url: api.getCurrentRoles,
    method: 'get',
    data: params,
  })
}

export const saveProfile = params => {
  const { _id } = params

  return request({
    url: api.saveProfile.replace(':id', _id),
    method: 'put',
    data: params,
  })
}
