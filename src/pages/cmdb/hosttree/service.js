import { request, config, storage } from 'utils'

const { api } = config


export function getProfile(params) {
  const user = storage.get('user')
  return request({
    url: api.getProfile.replace(':id', user.user_id),
    method: 'get',
    data: params,
  })
}


export const getCurrentGroups = params => {
  const user = storage.get('user')

  return request({
    url: api.getCurrentGroups.replace(':userId', user.user_id),
    method: 'get',
    data: params,
  })
}

export const getGroupNodes = params => {
  const { _id } = params

  return request({
    url: api.getGroupNodes.replace(':id', _id),
    method: 'get',
    data: params,
  })
}


export const getNodeInfo = params => {
  const { _id } = params

  return request({
    url: api.getNodeInfo.replace(':id', _id),
    method: 'get',
    data: params,
  })
}


export const getGroupInfo = params => {
  const { _id } = params

  return request({
    url: api.getGroupInfo.replace(':id', _id),
    method: 'get',
    data: params,
  })
}

