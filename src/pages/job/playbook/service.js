import { request, config } from 'utils'

const { api } = config
export function getBookshelf(params) {
  return request({
    url: api.allBooks,
    method: 'get',
    data: params,
  })
}

export function getPlaybooks(params) {
  const { name } = params
  return request({
    url: api.playbooks.replace('{name}', name),
    method: 'get',
    data: params,
  })
}

export function getInventory(params) {
  const { name } = params
  return request({
    url: api.inventory.replace('{name}', name),
    method: 'get',
    data: params,
  })
}

export function getRoles(params) {
  const { id } = params
  return request({
    url: api.roles.replace('{id}', id),
    method: 'get',
    data: params,
  })
}

export function getEntry(params) {
  const { id } = params
  if (!id) {
    return false
  }
  return request({
    url: api.entry.replace('{id}', id),
    method: 'get',
    data: params,
  })
}


export function addJob(params) {
  return request({
    url: api.addJobs,
    method: 'post',
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

export const fetchTags = params => {
  return request({
    url: api.playbookTags,
    method: 'post',
    data: params,
  })
}

export const getUserByName = params => {
  const url = api.searchUsers
  return request({
    url: url,
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

export const getCredentials = params => {
  const url = api.getCredentials
  return request({
    url: url,
    method: 'get',
    data: params,
  })
}

export const getApps = params => {
  return request({
    url: api.getApps,
    method: 'get',
    data: params,
  })
}

export const getJobDetail = params => {
  return request({
    url: api.getJobDetail.replace(':id', params._id),
    method: 'get',
    data: params,
  })
}
