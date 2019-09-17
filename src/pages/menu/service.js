import { request, config, storage } from 'utils'

const { api } = config


export function getMenus(params) {
  return request({
    url: api.getMenus,
    method: 'get',
    data: params,
  })
}

export function addMenu(params) {
  return request({
    url: api.addMenu,
    method: 'post',
    data: params,
  })
}


export function updateMenu(params) {
  const { _id } = params
  if (!_id) {
    return Promise.reject('invalid ID')
  }

  return request({
    url: api.editMenu,
    method: 'put',
    data: params,
  })
}
