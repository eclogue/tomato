import { request, config } from 'utils'
const { api } = config

export function getCredentials(params) {
  return request({
    url: api.getCredentials,
    method: 'get',
    data: params,
  })
}

export function addCredential(params) {
  const url = api.addCredential
  const body = {
    url: url,
    method: 'post',
    data: params,
  }
  return request(body)
}

export const getUserByName = params => {
  const url = api.searchUsers
  return request({
    url: url,
    method: 'get',
    data: params,
  })
}

export const updateCredential = params => {
  const id = params._id
  if (!id) {
    return Promise.reject('invalid params')
  }

  const url = api.updateCredential

  return request({
    url: url.replace(':id', id),
    method: 'put',
    data: params,
  })
}
