import { request, config, storage } from 'utils'
import { func } from 'prop-types'

const { api } = config
export function getDevices(params) {
  return request({
    url: api.getDevices,
    method: 'get',
    data: params,
  })
}

export function addInventory(params) {
  const url = api.addInventory
  const body = {
    url: url,
    method: 'post',
    data: params,
  }

  if (params.type === 'file') {
    body.headers = { 'Content-Type': 'multipart/form-data' }
  }

  return request(body)
}

export function addInventoryManual(params) {
  const url = api.addInventory
  return request({
    url: url,
    method: 'post',
    data: params,
    headers: { 'Content-Type': 'multipart/form-data' },
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

export const updateInventory = params => {
  const id = params._id
  if (!id) {
    return false
  }

  const url = api.updateInventory

  return request({
    url: url.replace(':id', id),
    method: 'post',
    data: params,
  })
}

export const searchRegions = params => {
  const url = api.getRegions
  return request({
    url: url,
    method: 'get',
    data: params,
  })
}

export const searchGroups = params => {
  const url = api.getGroups
  return request({
    url: url,
    method: 'get',
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

export const delInventory = params => {
  const id = params._id
  if (!id) {
    return false
  }

  const url = api.delDevice

  return request({
    url: url.replace(':id', id),
    method: 'delete',
    data: params,
  })
}
