import { request, config } from 'utils'
const { api } = config


export function getTeams(params) {
  return request({
    url: api.getTeams,
    method: 'get',
    data: params,
  })
}

export function getTeamInfo(params) {
  const { id } = params
  if (!id) {
    return Promise.reject('Illegal ID')
  }

  return request({
    url: api.getTeamInfo.replace(':id', id),
    method: 'get',
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

export const bindHosts = params => {
  const { userId } = params
  if (!userId) {
    return false
  }

  return request({
    url: api.bindHosts.replace(':id', userId),
    method: 'post',
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


export const getGroupHosts = params => {
  const { _id } = params
  if (!_id) {
    return false
  }

  return request({
    url: api.getGroupHosts.replace(':id', _id),
    method: 'get',
    data: params,
  })
}
