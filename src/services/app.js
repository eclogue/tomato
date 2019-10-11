import request from '../utils/request'
import config from '../utils/config'
import storage from '../utils/storage'
const { api } = config
const { user, userLogout, userLogin, menus } = api

export function login(params) {
  return request({
    url: userLogin,
    method: 'post',
    data: params,
  })
}

export function logout() {
  storage.remove('user')

  return Promise.resolve(true)
}

export function query(params) {
  return request({
    url: user.replace('/:id', ''),
    method: 'get',
    data: params,
  })
}

export const getUser = params => {
  return storage.get('user')
}

export const getMenus = params => {
  const { user } = params
  if (!user) {
    return null
  }

  return request({
    url: menus,
    method: 'get',
  })
}

export const getNotify = params => {
  return request({
    url: api.getNotifications,
    method: 'get',
    data: params,
  })
}

export const markNotifications = params => {
  return request({
    url: api.markNotifications,
    method: 'put',
    data: params,
  })
}
