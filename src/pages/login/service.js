import request from '../../utils/request'
import config from '../../utils/config'
import storage from '../../utils/storage'

const { api } = config
const { userLogin } = api

export const login = async data => {
  return request({
    url: userLogin,
    method: 'post',
    data,
  })
}
