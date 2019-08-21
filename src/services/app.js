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

export function logout(params) {
  return request({
    url: userLogout,
    method: 'get',
    data: params,
  })
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
