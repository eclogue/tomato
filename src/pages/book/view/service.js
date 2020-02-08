import { request, config } from 'utils'
import { message } from 'antd'

const { api } = config

export function editPlaybook(params) {
  const { _id } = params
  if (!_id) {
    return false
  }

  const url = api.editFile
  return request({
    url: url.replace(':id', _id),
    method: 'put',
    data: params,
  })
}

export function upload(params) {
  return request(
    {
      url: api.playbookDumper,
      method: 'get',
      params: params,
      responseType: 'blob',
    },
    true
  )
}

export const show = params => {
  return request({
    url: api.playbookDumper,
    method: 'get',
    data: params,
  })
}

export const getPlaybook = params => {
  const { id } = params
  if (!id) {
    return message.error('invalid book')
  }

  return request({
    url: api.getPlaybook.replace(':id', id),
    method: 'get',
    data: params,
  })
}

export const uploadFile = params => {
  return request({
    url: api.playbookUpload,
    method: 'post',
    data: params,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const addFolder = params => {
  return request({
    url: api.playbookAddFolder,
    method: 'post',
    data: params,
  })
}

export function getFile(params) {
  const { id } = params
  const url = api.getPlaybookFile
  return request({
    url: url.replace(':id', id),
    method: 'get',
    data: params,
  })
}

export function updateFile(params) {
  const { id } = params
  const url = api.getPlaybookFile
  return request({
    url: url.replace(':id', id),
    method: 'patch',
    data: params,
  })
}

export function renameFile(params) {
  const { id } = params
  const url = api.renamePlaybookFile
  return request({
    url: url.replace(':id', id),
    method: 'patch',
    data: params,
  })
}

export function searchConfig(params) {
  const { pId } = params
  if (!pId) {
    return Promise.reject('invalid params')
  }

  return request({
    url: api.getPlaybookRegister.replace(':pId', pId),
    method: 'get',
  })
}

export function listConfigs(params) {
  const ids = params.ids
  if (!ids) {
    return false
  }
  params.ids = ids.join(',')
  return request({
    url: api.listConfig,
    method: 'get',
    data: params,
  })
}

export const removeFile = params => {
  const { id } = params
  const url = api.editFile
  return request({
    url: url.replace(':id', id),
    method: 'delete',
    data: params,
  })
}

export function run(params) {
  const { id, options, args } = params
  const url = api.runBook
  return request({
    url: url.replace(':id', id),
    method: 'post',
    data: { args, options },
  })
}
